// test/cti_mock_exam_and_hskk.test.js
// Validates International CTI Standard HSK Mock Exams, iBT Strict Mode, CTI Electronic Score Report & HSKK Oral Exam Lab

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

test('International CTI Standard HSK Mock Exams & HSKK Oral Exam Lab', async (t) => {
  const mockexamJs = fs.readFileSync(path.join(PUBLIC, 'js', 'features', 'mockexam.js'), 'utf8');
  const hskkJs = fs.readFileSync(path.join(PUBLIC, 'js', 'features', 'hskk_exam.js'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');

  // -------------------------------------------------------------
  // Test 1: Full-Scale Benchmark Exam Structure across HSK 1 - 6
  // -------------------------------------------------------------
  await t.test('1. Full-Scale CTI Benchmark Exams Scale & Item Integrity', () => {
    const expectedBenchmarks = {
      1: { count: 40, hasListening: true, hasReading: true, hasWriting: false, totalScore: 200, passScore: 120 },
      2: { count: 60, hasListening: true, hasReading: true, hasWriting: false, totalScore: 200, passScore: 120 },
      3: { count: 80, hasListening: true, hasReading: true, hasWriting: true, totalScore: 300, passScore: 180 },
      4: { count: 100, hasListening: true, hasReading: true, hasWriting: true, totalScore: 300, passScore: 180 },
      5: { count: 100, hasListening: true, hasReading: true, hasWriting: true, totalScore: 300, passScore: 180 },
      6: { count: 101, hasListening: true, hasReading: true, hasWriting: true, totalScore: 300, passScore: 180 }
    };

    for (let lvl = 1; lvl <= 6; lvl++) {
      const exams = JSON.parse(fs.readFileSync(path.join(PUBLIC, 'data', 'exams', `hsk${lvl}.json`), 'utf8'));
      assert.strictEqual(exams.length, 60, `HSK ${lvl} must have 60 exams`);

      const bench = exams[0]; // Test 1 Benchmark Exam
      const spec = expectedBenchmarks[lvl];

      assert.strictEqual(bench.testNumber, 1, `Benchmark exam must be Test 1 for HSK ${lvl}`);
      assert.strictEqual(bench.totalScore, spec.totalScore, `HSK ${lvl} total score mismatch`);
      assert.strictEqual(bench.passScore, spec.passScore, `HSK ${lvl} pass score mismatch`);
      assert.strictEqual(bench.questions.length, spec.count, `HSK ${lvl} Benchmark exam must have exactly ${spec.count} questions`);

      const listeningCount = bench.questions.filter(q => q.skill === 'listening' || (q.section || '').includes('听力') || (q.section || '').includes('Nghe')).length;
      const readingCount = bench.questions.filter(q => q.skill === 'reading' || (q.section || '').includes('阅读') || (q.section || '').includes('Đọc')).length;
      const writingCount = bench.questions.filter(q => q.skill === 'writing' || (q.section || '').includes('书写') || (q.section || '').includes('Viết')).length;

      assert.ok(listeningCount > 0, `HSK ${lvl} Benchmark must have listening questions`);
      assert.ok(readingCount > 0, `HSK ${lvl} Benchmark must have reading questions`);
      if (spec.hasWriting) {
        assert.ok(writingCount > 0, `HSK ${lvl} Benchmark must have writing questions`);
      } else {
        assert.strictEqual(writingCount, 0, `HSK ${lvl} should NOT have writing section (Hanban CTI standard)`);
      }

      // Check specific item types in higher levels
      if (lvl === 4) {
        const hasSegmentReorder = bench.questions.some(q => q.type === 'reorder_segments' || q.segments);
        const hasLookAndWrite = bench.questions.some(q => q.type === 'look_and_write' || q.keyword);
        assert.strictEqual(hasSegmentReorder, true, 'HSK 4 Benchmark must include 排列顺序 (Segment Reorder A-B-C)');
        assert.strictEqual(hasLookAndWrite, true, 'HSK 4 Benchmark must include 看图造句 (Look and Write)');
      } else if (lvl === 5) {
        const hasEssays = bench.questions.some(q => q.type === 'essay');
        assert.strictEqual(hasEssays, true, 'HSK 5 Benchmark must include 80-word short essay questions');
      } else if (lvl === 6) {
        const hasErrorDetection = bench.questions.some(q => q.type === 'error_detection' || q.isErrorDetection);
        assert.strictEqual(hasErrorDetection, true, 'HSK 6 Benchmark must include 找病句 (Error Detection)');
      }
    }
  });

  // -------------------------------------------------------------
  // Test 2: HTML Markup Integration & iBT Phase Controls
  // -------------------------------------------------------------
  await t.test('2. HTML Elements for iBT Exam Mode, CTI Report & HSKK Lab', () => {
    assert.ok(indexHtml.includes('id="btnExamModePractice"'), 'Includes Practice Mode Button');
    assert.ok(indexHtml.includes('id="btnExamModeIbt"'), 'Includes iBT Strict Mode Button');
    assert.ok(indexHtml.includes('id="examIbtBanner"'), 'Includes iBT Phase Indicator Banner');
    assert.ok(indexHtml.includes('id="examIbtPhaseBadge"'), 'Includes iBT Phase Badge');
    assert.ok(indexHtml.includes('openHskkExamModal()'), 'Includes HSKK Trigger Button');
    assert.ok(indexHtml.includes('id="officialCtiScoreModal"'), 'Includes CTI Official Score Report Modal');
    assert.ok(indexHtml.includes('id="hskkExamModal"'), 'Includes HSKK Oral Exam Modal');
    assert.ok(indexHtml.includes('src="js/features/hskk_exam.js"'), 'Includes hskk_exam.js script reference');
  });

  // -------------------------------------------------------------
  // Test 3: Simulation of iBT Mode, Audio Strictness & Section Locking
  // -------------------------------------------------------------
  await t.test('3. Simulation of iBT Mode, Audio Strictness & Question Handlers', () => {
    const dom = {
      btnExamModePractice: { className: '' },
      btnExamModeIbt: { className: '' },
      examIbtBanner: { classList: { remove() {}, add() {} } },
      examIbtPhaseBadge: { innerText: '' },
      examIbtPhaseDesc: { innerText: '' },
      examTimerDisplay: { innerText: '', className: '' },
      examAnsweredCountText: { innerText: '' },
      examProgressBar: { style: {} },
      mockExamQuestionsContainer: { innerHTML: '' },
      examQuestionPalette: { innerHTML: '' },
      examTestNumberSelect: { innerHTML: '', value: '1', appendChild() {} },
      examLevelBadge: { innerText: '' },
      examScoreInfo: { innerText: '' },
      examTitleDisplay: { innerText: '' },
      examDescDisplay: { innerText: '' },
      examPartBtn_listening: { innerHTML: '', className: '', classList: { remove() {}, add() {} } },
      examPartBtn_reading: { innerHTML: '', className: '', classList: { remove() {}, add() {} } },
      examPartBtn_writing: { innerHTML: '', className: '', classList: { remove() {}, add() {} } },
      examPartBtn_all: { className: '' },
      examResultEmoji: { innerText: '' },
      examResultTitle: { innerText: '' },
      examResultSubtitle: { innerText: '' },
      examScoreValue: { innerText: '' },
      examMaxScoreValue: { innerText: '' },
      examResultBadge: { className: '', innerText: '' },
      examAnswerBreakdown: { innerHTML: '' },
      officialCtiScoreContainer: { innerHTML: '' }
    };

    let toastMessage = '';
    const sandbox = {
      console,
      window: {},
      document: {
        getElementById: (id) => dom[id] || null,
        createElement: (tag) => ({ appendChild() {}, classList: { add() {}, remove() {} }, style: {} })
      },
      showToast: (msg) => { toastMessage = msg; },
      playChineseTTS: () => {},
      addExp: () => {},
      localStorage: {
        getItem: () => null,
        setItem: () => {}
      },
      setInterval: () => 123,
      clearInterval: () => {}
    };

    vm.createContext(sandbox);
    vm.runInContext(mockexamJs, sandbox);

    // Mock an active exam with segment reorder and look_and_write
    sandbox.setActiveMockExam({
      level: 4,
      testNumber: 1,
      title: 'Đề Thi Thử HSK 4 Chuẩn CTI Hanban',
      durationMinutes: 100,
      totalScore: 300,
      passScore: 180,
      questions: [
        {
          id: 'q_listen_1',
          skill: 'listening',
          section: 'Phần 1: Nghe Hiểu',
          audioText: '外面下大雨了。',
          options: [{ key: 'A', text: 'Mưa', isCorrect: true }, { key: 'B', text: 'Nắng', isCorrect: false }],
          explanation: 'Mưa to.'
        },
        {
          id: 'q_seg_1',
          skill: 'reading',
          type: 'reorder_segments',
          section: 'Phần 2: Sắp Xếp Vế Câu A-B-C',
          prompt: 'Sắp xếp theo thứ tự đúng:',
          segments: [
            { key: 'A', text: 'Vế A' },
            { key: 'B', text: 'Vế B' },
            { key: 'C', text: 'Vế C' }
          ],
          correctSegmentOrder: ['C', 'A', 'B'],
          explanation: 'Thứ tự C-A-B.'
        },
        {
          id: 'q_write_1',
          skill: 'writing',
          type: 'look_and_write',
          section: 'Phần 3: Nhìn Tranh Đặt Câu',
          prompt: 'Dùng từ khóa đặt câu:',
          keyword: '弹钢琴',
          minChars: 8,
          expectedSample: '她在房间里弹钢琴。',
          explanation: 'Chứa từ 弹钢琴.'
        }
      ]
    });

    // 1. Toggle to iBT Strict Mode
    sandbox.toggleExamMode('ibt');
    assert.ok(toastMessage.includes('iBT QUỐC TẾ'), 'iBT mode activation toast fired');

    // 2. Audio playback strict enforcement (HSK 4: Max 1 play)
    sandbox.playExamAudioStrict('q_listen_1', '外面下大雨了。', 'female');
    // Try playing again -> must be blocked
    sandbox.playExamAudioStrict('q_listen_1', '外面下大雨了。', 'female');
    assert.ok(toastMessage.includes('1 lần duy nhất'), 'Blocked second audio play in HSK 4 iBT mode');

    // 3. Test segment reordering operations
    sandbox.addExamSegmentOrder('q_seg_1', 'C');
    sandbox.addExamSegmentOrder('q_seg_1', 'A');
    sandbox.addExamSegmentOrder('q_seg_1', 'B');

    // 4. Test look and write input
    sandbox.setExamEssayInput('q_write_1', '小女孩在认真地弹钢琴。');

    // 5. Submit exam and verify scoring
    sandbox.submitMockExam();

    assert.ok(dom.examScoreValue.innerText !== '', 'Score was computed');
    assert.ok(dom.examAnswerBreakdown.innerHTML.includes('Phiếu Điểm Khảo Thí CTI'), 'Result includes CTI Score Report prompt');

    // 6. Render Official CTI Certificate with Radar Spider Chart
    sandbox.renderOfficialCtiCertificateContent();
    assert.ok(dom.officialCtiScoreContainer.innerHTML.includes('汉语水平考试 (HSK) 成绩报告'), 'Official Hanban CTI header rendered');
    assert.ok(dom.officialCtiScoreContainer.innerHTML.includes('Biểu Đồ Radar Năng Lực 5 Chiều'), '5-axis Spider Radar Chart rendered');
    assert.ok(dom.officialCtiScoreContainer.innerHTML.includes('polygon points='), 'SVG Polygon coordinates calculated');
    assert.ok(dom.officialCtiScoreContainer.innerHTML.includes('Chẩn Đoán Học Thuật'), 'Academic diagnosis rendered');
  });

  // -------------------------------------------------------------
  // Test 4: HSKK Oral Exam Lab Datasets & AI Scoring Logic
  // -------------------------------------------------------------
  await t.test('4. HSKK Oral Exam Lab (初级, 中级, 高级) & AI Scoring', () => {
    const hskkDom = {
      hskkModalTitle: { innerText: '' },
      hskkTargetHskBadge: { innerText: '' },
      hskkDurationBadge: { innerText: '' },
      hskkQuestionProgress: { innerText: '' },
      hskkQuestionCard: { innerHTML: '' },
      'btn-hskk-lvl-elementary': { className: '' },
      'btn-hskk-lvl-intermediate': { className: '' },
      'btn-hskk-lvl-advanced': { className: '' }
    };

    let toastHskk = '';
    const hskkSandbox = {
      console,
      window: {},
      document: {
        getElementById: (id) => hskkDom[id] || null
      },
      showToast: (m) => { toastHskk = m; },
      playChineseTTS: () => {},
      addExp: () => {},
      refreshIcons: () => {}
    };

    vm.createContext(hskkSandbox);
    vm.runInContext(hskkJs, hskkSandbox);

    // Initial setup
    hskkSandbox.initHskkExamModule();
    assert.ok(hskkDom.hskkModalTitle.innerText.includes('Trung Cấp'), 'Default HSKK level is intermediate');

    // Test level switching to Advanced
    hskkSandbox.switchHskkLevel('advanced');
    assert.ok(hskkDom.hskkModalTitle.innerText.includes('Cao Cấp'), 'Switched to HSKK Advanced');
    assert.ok(hskkDom.hskkQuestionCard.innerHTML.includes('听后复述') || hskkDom.hskkQuestionCard.innerHTML.includes('朗读'), 'Includes Advanced sections');

    // Test level switching to Elementary
    hskkSandbox.switchHskkLevel('elementary');
    assert.ok(hskkDom.hskkModalTitle.innerText.includes('Sơ Cấp'), 'Switched to HSKK Elementary');

    // Simulate AI Oral Evaluation
    const questions = hskkSandbox.getAllHskkQuestionsForCurrentLevel();
    assert.ok(questions.length > 0, 'Elementary level has questions');
    hskkSandbox.evaluateHskkSubmission(questions[0].id);

    assert.ok(toastHskk.includes('Giám khảo AI chấm'), 'AI Oral evaluation toast displayed');
    assert.ok(hskkDom.hskkQuestionCard.innerHTML.includes('Kết Quả Chấm Điểm Khẩu Ngữ CTI'), 'Card displays 4-criterion oral rubric results');
    assert.ok(hskkDom.hskkQuestionCard.innerHTML.includes('Phát âm & Thanh điệu'), 'Includes pronunciation criterion');
    assert.ok(hskkDom.hskkQuestionCard.innerHTML.includes('Độ lưu loát'), 'Includes fluency criterion');
  });
});
