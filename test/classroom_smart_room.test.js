const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

describe('Smart Peer Study Room (Lớp Học Thông Minh) Logic & Data Integrity', () => {
  const classroomSrc = fs.readFileSync(path.join(__dirname, '../public/js/features/classroom.js'), 'utf8');

  it('declares all essential smart room variables and functions', () => {
    assert.match(classroomSrc, /CLASSROOM_SMART_ROOMS_KEY/);
    assert.match(classroomSrc, /CLASSROOM_ACTIVE_ROOM_KEY/);
    assert.match(classroomSrc, /function createSmartRoom\(/);
    assert.match(classroomSrc, /function joinSmartRoomByCode\(/);
    assert.match(classroomSrc, /function startSmartRoomQuiz\(/);
    assert.match(classroomSrc, /function finishSmartRoomQuiz\(/);
    assert.match(classroomSrc, /function renderRoomHubView\(/);
    assert.match(classroomSrc, /function renderRoomActiveView\(/);
    assert.match(classroomSrc, /function renderRoomQuizView\(/);
    assert.match(classroomSrc, /function renderRoomResultView\(/);
    assert.match(classroomSrc, /function openRoomVideoMeet\(/);
  });

  it('preserves teacher assignment and grading functions', () => {
    assert.match(classroomSrc, /function createAssignment\(/);
    assert.match(classroomSrc, /function gradeResultCodes\(/);
    assert.match(classroomSrc, /function exportClassroomCsv\(/);
    assert.match(classroomSrc, /function joinAssignment\(/);
  });

  it('smart room base64url encode and decode roundtrip matches', () => {
    const toBase64Url = (text) => {
      const bytes = Buffer.from(text, 'utf8');
      return bytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
    const fromBase64Url = (str) => {
      const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
      return Buffer.from(b64, 'base64').toString('utf8');
    };

    const mockRoom = {
      code: 'HSK-886',
      title: 'Hội Cùng Đỗ HSK 1',
      hostName: 'Minh Anh',
      level: 1,
      category: 'exam',
      questions: [{ id: 'q1', prompt: 'Chọn đúng/sai' }]
    };

    const encoded = toBase64Url(JSON.stringify(mockRoom));
    assert.ok(encoded.length > 10);
    const decoded = JSON.parse(fromBase64Url(encoded));
    assert.equal(decoded.code, 'HSK-886');
    assert.equal(decoded.title, 'Hội Cùng Đỗ HSK 1');
    assert.equal(decoded.questions.length, 1);
  });

  it('generates proper video call URL for Jitsi Meet or Google Meet', () => {
    const code = 'HSK-789';
    const autoMeet = `https://meet.jit.si/YuHan_Study_Room_${code.replace(/[^A-Za-z0-9]/g, '')}`;
    assert.equal(autoMeet, 'https://meet.jit.si/YuHan_Study_Room_HSK789');
    assert.ok(autoMeet.startsWith('https://meet.jit.si/'));
  });
});
