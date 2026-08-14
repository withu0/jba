<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('manga_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('manga_category_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manga_category_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('name');
            $table->timestamps();

            $table->unique(['manga_category_id', 'locale']);
        });

        Schema::create('manga_episodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manga_category_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        Schema::create('manga_episode_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manga_episode_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['manga_episode_id', 'locale']);
        });

        $hasPages = DB::table('manga_pages')->exists();

        Schema::table('manga_pages', function (Blueprint $table) use ($hasPages) {
            if ($hasPages) {
                $table->foreignId('manga_episode_id')
                    ->nullable()
                    ->after('id')
                    ->constrained()
                    ->cascadeOnDelete();
            } else {
                $table->foreignId('manga_episode_id')
                    ->after('id')
                    ->constrained()
                    ->cascadeOnDelete();
            }

            $table->index(['manga_episode_id', 'locale', 'sort_order']);
        });

        if ($hasPages) {
            $episodeId = $this->ensureDefaultEpisode();

            DB::table('manga_pages')
                ->whereNull('manga_episode_id')
                ->update(['manga_episode_id' => $episodeId]);

            Schema::table('manga_pages', function (Blueprint $table) {
                $table->foreignId('manga_episode_id')->nullable(false)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manga_pages', function (Blueprint $table) {
            $table->dropIndex(['manga_episode_id', 'locale', 'sort_order']);
            $table->dropConstrainedForeignId('manga_episode_id');
        });

        Schema::dropIfExists('manga_episode_translations');
        Schema::dropIfExists('manga_episodes');
        Schema::dropIfExists('manga_category_translations');
        Schema::dropIfExists('manga_categories');
    }

    private function ensureDefaultEpisode(): int
    {
        $now = now();

        $categoryId = DB::table('manga_categories')->where('slug', 'welcome')->value('id');

        if ($categoryId === null) {
            $categoryId = DB::table('manga_categories')->insertGetId([
                'slug' => 'welcome',
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach ([
                'ja' => 'ウェルカム',
                'en' => 'Welcome',
                'zh' => '欢迎',
            ] as $locale => $name) {
                DB::table('manga_category_translations')->insert([
                    'manga_category_id' => $categoryId,
                    'locale' => $locale,
                    'name' => $name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        $episodeId = DB::table('manga_episodes')->where('slug', 'episode-1')->value('id');

        if ($episodeId === null) {
            $episodeId = DB::table('manga_episodes')->insertGetId([
                'manga_category_id' => $categoryId,
                'slug' => 'episode-1',
                'sort_order' => 1,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach ([
                'ja' => ['title' => '第1話', 'description' => '美容鍼の世界をめくる、はじめての一冊。'],
                'en' => ['title' => 'Episode 1', 'description' => 'Turn the pages to explore beauty acupuncture.'],
                'zh' => ['title' => '第1集', 'description' => '翻页了解美容针灸的世界。'],
            ] as $locale => $content) {
                DB::table('manga_episode_translations')->insert([
                    'manga_episode_id' => $episodeId,
                    'locale' => $locale,
                    'title' => $content['title'],
                    'description' => $content['description'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        return (int) $episodeId;
    }
};
