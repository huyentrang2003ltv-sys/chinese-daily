const https = require('https');
const fs = require('fs');
const path = require('path');

function postJSON(apiPath, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'quantri.tiengtrunggioi.vn',
      path: apiPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${data.slice(0, 100)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

// Map emojis for topic keywords
function getTopicIcon(name) {
  const n = name.toLowerCase();
  if (n.includes('hàn xì') || n.includes('cơ khí')) return '⚙️';
  if (n.includes('gạo') || n.includes('bột') || n.includes('thịt') || n.includes('gia cầm') || n.includes('hải sản') || n.includes('rau') || n.includes('nấm')) return '🥦';
  if (n.includes('bánh kẹo') || n.includes('gia vị') || n.includes('đồ uống')) return '🍜';
  if (n.includes('thể thao') || n.includes('bóng') || n.includes('golf') || n.includes('tennis') || n.includes('điền')) return '⚽';
  if (n.includes('khách sạn') || n.includes('nhà hàng') || n.includes('dự tiệc')) return '🏨';
  if (n.includes('kiến trúc') || n.includes('xây dựng') || n.includes('nội thất')) return '🏛️';
  if (n.includes('xe máy') || n.includes('ô tô') || n.includes('giao thông') || n.includes('bến xe')) return '🚗';
  if (n.includes('mỹ phẩm') || n.includes('cắt tóc') || n.includes('spa')) return '💄';
  if (n.includes('gia đình') || n.includes('cưới hỏi') || n.includes('độc thân')) return '👨‍👩‍👧‍👦';
  if (n.includes('tình yêu') || n.includes('ngôn tình')) return '💖';
  if (n.includes('máy bay') || n.includes('sân bay') || n.includes('xuất nhập cảnh') || n.includes('du lịch') || n.includes('picnic')) return '✈️';
  if (n.includes('quần áo') || n.includes('vải') || n.includes('may mặc') || n.includes('dệt')) return '👗';
  if (n.includes('điện thoại') || n.includes('word') || n.includes('điện tử')) return '📱';
  if (n.includes('văn phòng') || n.includes('nhân sự') || n.includes('phỏng vấn') || n.includes('sơ yếu')) return '💼';
  if (n.includes('luật') || n.includes('tố tụng') || n.includes('tội phạm') || n.includes('chính trị')) return '⚖️';
  if (n.includes('thời tiết') || n.includes('thời gian')) return '🌦️';
  if (n.includes('hoa')) return '🌸';
  if (n.includes('bất động sản') || n.includes('thuê nhà') || n.includes('phòng tắm')) return '🏠';
  if (n.includes('mua bán') || n.includes('tiền tệ') || n.includes('hợp đồng') || n.includes('thương hiệu') || n.includes('quảng cáo')) return '💰';
  if (n.includes('bưu điện')) return '📮';
  if (n.includes('phòng cháy')) return '🚒';
  if (n.includes('phim') || n.includes('showbiz') || n.includes('chụp ảnh')) return '🎬';
  return '🏷️';
}

async function scrapeAllTopics() {
  console.log('1. Fetching all topics list from tiengtrunggioi.vn...');
  const topicsRes = await postJSON('/api/public/v1/vocabularytopics/search', { pageSize: 200, pageIndex: 1 });
  
  if (!topicsRes || !topicsRes.data) {
    throw new Error('Could not fetch topics list');
  }

  // Filter only thematic topics (ignore HSK and TOCFL test levels)
  const thematicTopics = topicsRes.data.filter(t => 
    !t.name.startsWith('HSK') && 
    !t.name.startsWith('TOCFL') &&
    t.isActive !== false
  );

  console.log(`Found ${thematicTopics.length} active thematic topics.`);

  const topicsList = [];
  const allVocabularies = [];
  const CONCURRENCY = 6;

  for (let i = 0; i < thematicTopics.length; i += CONCURRENCY) {
    const chunk = thematicTopics.slice(i, i + CONCURRENCY);
    const promises = chunk.map(async (topic) => {
      try {
        const vocabRes = await postJSON('/api/public/v1/vocabularytopics/vocabulary-topic', {
          id: topic.id,
          pageNumber: 1,
          pageSize: 300
        });

        const rawVocabs = (vocabRes.data && vocabRes.data.vocabularies) || [];
        const cleanTopicId = topic.code || topic.id;
        const icon = getTopicIcon(topic.name);

        const cleanTopic = {
          id: cleanTopicId,
          uuid: topic.id,
          name: topic.name.replace(/^Từ vựng\s*(chủ đề|về|chuyên ngành)?\s*/i, (m, g) => {
            return (g ? g.charAt(0).toUpperCase() + g.slice(1) + ' ' : '');
          }).trim() || topic.name,
          fullName: topic.name,
          icon,
          desc: topic.description || `Bộ từ vựng chủ đề ${topic.name} chuẩn ngữ cảnh giao tiếp thực tế`,
          count: rawVocabs.length
        };

        const words = rawVocabs.map((v, idx) => ({
          title: (v.word || '').trim(),
          pinyin: (v.pinyin || v.phonetic || '').trim(),
          zhuyin: (v.zhuyin || '').trim(),
          meaning: (v.meaningVi || '').trim(),
          pos: (v.vocabularyWordTypes && v.vocabularyWordTypes[0] && v.vocabularyWordTypes[0].wordType) ? v.vocabularyWordTypes[0].wordType.name : 'từ vựng',
          level: 1 + (idx % 4), // Distributed tier
          topicId: cleanTopicId,
          topicName: cleanTopic.name,
          topicIcon: icon,
          hanviet: (v.phonetic || '').trim(),
          audioUrl: v.audioUrl ? `https://quantri.tiengtrunggioi.vn/${v.audioUrl}` : null,
          imageUrl: v.imageUrl ? `https://quantri.tiengtrunggioi.vn/${v.imageUrl}` : null,
          exampleSentence: v.exampleSentenceHanzi || '',
          examplePinyin: v.exampleSentencePinyin || '',
          exampleMeaning: v.exampleSentenceTranslation || ''
        })).filter(w => w.title && w.meaning);

        return { topic: cleanTopic, words };
      } catch (err) {
        console.error(`Error fetching topic ${topic.name}:`, err.message);
        return null;
      }
    });

    const results = await Promise.all(promises);
    results.forEach(res => {
      if (res && res.topic && res.words.length > 0) {
        res.topic.count = res.words.length;
        topicsList.push(res.topic);
        allVocabularies.push(...res.words);
      }
    });

    console.log(`Fetched ${Math.min(i + CONCURRENCY, thematicTopics.length)}/${thematicTopics.length} topics. Total words so far: ${allVocabularies.length}`);
  }

  // Sort topics by count descending
  topicsList.sort((a, b) => b.count - a.count);

  console.log(`\nDONE! Total topics: ${topicsList.length}, Total vocabularies: ${allVocabularies.length}`);

  // Save to data/topics.json
  fs.writeFileSync('data/topics.json', JSON.stringify(topicsList, null, 2), 'utf8');
  console.log('Saved data/topics.json');

  // Save to data/thematic_vocab.json
  fs.writeFileSync('data/thematic_vocab.json', JSON.stringify(allVocabularies, null, 2), 'utf8');
  console.log('Saved data/thematic_vocab.json');
}

scrapeAllTopics().catch(console.error);
