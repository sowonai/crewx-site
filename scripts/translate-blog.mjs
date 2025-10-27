#!/usr/bin/env node

/**
 * Blog Translation Script
 *
 * 한글 블로그 → 영어 번역 자동화 스크립트
 * CrewX blog_translator 에이전트를 활용하여 번역합니다.
 */

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// 디렉토리 경로
const KO_BLOG_DIR = join(projectRoot, 'i18n/ko/docusaurus-plugin-content-blog');
const EN_BLOG_DIR = join(projectRoot, 'blog');

/**
 * 블로그 파일 목록 가져오기 (authors.yml, tags.yml, options.json 제외)
 */
function getBlogFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir)
    .filter(file => file.endsWith('.md'))
    .filter(file => !file.startsWith('.'))
    .sort();
}

/**
 * 미번역 블로그 찾기 (한글에는 있지만 영어에는 없는 파일)
 */
function findUntranslatedBlogs() {
  const koFiles = getBlogFiles(KO_BLOG_DIR);
  const enFiles = getBlogFiles(EN_BLOG_DIR);

  const untranslated = koFiles.filter(file => !enFiles.includes(file));

  return untranslated;
}

/**
 * CrewX blog_translator 에이전트로 번역 실행
 */
function translateBlog(filename) {
  const koPath = `i18n/ko/docusaurus-plugin-content-blog/${filename}`;
  const enPath = `blog/${filename}`;

  console.log(`\n🔄 번역 중: ${filename}`);
  console.log(`   한글: ${koPath}`);
  console.log(`   영어: ${enPath}`);

  try {
    const command = `crewx x "@blog_translator Translate ${koPath} to English and save it to ${enPath}"`;

    execSync(command, {
      stdio: 'inherit',
      cwd: projectRoot
    });

    console.log(`✅ 번역 완료: ${filename}\n`);
    return true;
  } catch (error) {
    console.error(`❌ 번역 실패: ${filename}`);
    console.error(error.message);
    return false;
  }
}

/**
 * 메인 실행 함수
 */
function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'check';

  console.log('📝 CrewX Blog Translation Tool\n');
  console.log('=' .repeat(50));

  // 미번역 블로그 찾기
  const untranslated = findUntranslatedBlogs();

  if (untranslated.length === 0) {
    console.log('✅ 모든 한글 블로그가 영어로 번역되었습니다!\n');
    return;
  }

  console.log(`\n📋 미번역 블로그: ${untranslated.length}개\n`);
  untranslated.forEach((file, idx) => {
    console.log(`   ${idx + 1}. ${file}`);
  });
  console.log();

  // check 모드: 목록만 표시
  if (mode === 'check') {
    console.log('💡 번역을 실행하려면: npm run translate:ko-to-en\n');
    return;
  }

  // translate 모드: 실제 번역 실행
  if (mode === 'translate') {
    console.log('🚀 번역을 시작합니다...\n');
    console.log('=' .repeat(50));

    let successCount = 0;
    let failCount = 0;

    for (const file of untranslated) {
      const success = translateBlog(file);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('=' .repeat(50));
    console.log('\n📊 번역 결과:');
    console.log(`   ✅ 성공: ${successCount}개`);
    console.log(`   ❌ 실패: ${failCount}개`);
    console.log(`   📝 총: ${untranslated.length}개\n`);

    if (successCount > 0) {
      console.log('💡 다음 단계:');
      console.log('   1. git status 로 변경사항 확인');
      console.log('   2. 번역된 파일 검토');
      console.log('   3. git add . && git commit\n');
    }

    return;
  }

  console.log('❌ 알 수 없는 모드:', mode);
  console.log('사용법: npm run translate:check 또는 npm run translate:ko-to-en\n');
}

// 스크립트 실행
main();
