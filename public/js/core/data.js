// =========================================================================
// Data layer: JSON datasets are fetched lazily, once, when a tab needs them.
// =========================================================================
let dictionaryData = [];
let lessonsData = [];
let etymologyData = [];
let mindmapData = null;
let confusionsData = [];
let practiceData = [];
let cultureData = [];
let mockExamsData = [];
let aiScenariosData = [];
let conversations150Data = [];
let radicalsData = [];
let chengyuData = [];
let readingsData = [];
let grammarData = [];
let jiaochengData = null;
let topicsData = [];
let thematicVocabData = [];
let hsk30RoadmapData = null;
let woodBlockLevels = [];
let flipCardLevels = [];
let hanziDecompositionsData = {};
let multidimensionalWordsData = {};
let pinyinGuideData = null;
let vocabExpansionData = [];
let classifiersData = [];
let polyphonicWordsData = [];
let complementsData = [];
let dictationData = [];

const DATASETS = {
  dictionary: { url: 'data/dictionary.json', set: v => { dictionaryData = v || []; } },
  lessons: { url: 'data/lessons.json', set: v => { lessonsData = v || []; } },
  etymology: { url: 'data/etymology.json', set: v => { etymologyData = v || []; } },
  mindmap: { url: 'data/mindmap.json', set: v => { mindmapData = v || null; } },
  confusions: { url: 'data/confusions.json', set: v => { confusionsData = v || []; } },
  practice: { url: 'data/practice.json', set: v => { practiceData = v || []; } },
  culture: { url: 'data/culture.json', set: v => { cultureData = v || []; } },
  mockExam: { url: 'data/mock_exam.json', set: v => { mockExamsData = v || []; } },
  aiScenarios: { url: 'data/conversations_150.json', set: v => { aiScenariosData = v || []; conversations150Data = v || []; } },
  conversations150: { url: 'data/conversations_150.json', set: v => { conversations150Data = v || []; aiScenariosData = v || []; } },
  radicals: { url: 'data/radicals.json', set: v => { radicalsData = v || []; } },
  chengyu: { url: 'data/chengyu.json', set: v => { chengyuData = v || []; } },
  readings: { url: 'data/readings.json', set: v => { readingsData = v || []; } },
  grammar: { url: 'data/grammar_compendium.json', set: v => { grammarData = v || []; } },
  jiaocheng: { url: 'data/hanyu_jiaocheng.json', set: v => { jiaochengData = v || null; } },
  topics: { url: 'data/topics.json', set: v => { topicsData = v || []; } },
  thematicVocab: { url: 'data/thematic_vocab.json', set: v => { thematicVocabData = v || []; } },
  hsk30Roadmap: { url: 'data/hsk30_roadmap.json', set: v => { hsk30RoadmapData = v || null; } },
  woodBlock: { url: 'data/wood_block_levels.json', set: v => { woodBlockLevels = v || []; } },
  flipCard: { url: 'data/flip_card_levels.json', set: v => { flipCardLevels = v || []; } },
  hanziDecompositions: { url: 'data/hanzi_decompositions.json', set: v => { hanziDecompositionsData = v || {}; } },
  multidimensionalWords: { url: 'data/multidimensional_words.json', set: v => { multidimensionalWordsData = v || {}; } },
  multidimensional_words: { url: 'data/multidimensional_words.json', set: v => { multidimensionalWordsData = v || {}; } },
  pinyinData: { url: 'data/pinyin_guide.json', set: v => { pinyinGuideData = v || null; } },
  pinyinGuide: { url: 'data/pinyin_guide.json', set: v => { pinyinGuideData = v || null; } },
  vocabExpansion: { url: 'data/vocab_expansion.json', set: v => { vocabExpansionData = v || []; } },
  classifiers: { url: 'data/classifiers.json', set: v => { classifiersData = v || []; } },
  polyphonicWords: { url: 'data/polyphonic_words.json', set: v => { polyphonicWordsData = v || []; } },
  polyphonic: { url: 'data/polyphonic_words.json', set: v => { polyphonicWordsData = v || []; } },
  complements: { url: 'data/complements.json', set: v => { complementsData = v || []; } },
  dictation: { url: 'data/dictation_sentences.json', set: v => { dictationData = v || []; } }
};

const dataPromises = new Map();
const loadedDatasets = new Set();

function isDataLoaded(names) {
  return (names || []).every(name => loadedDatasets.has(name));
}

/** Fetch a dataset once and assign it to its global; resolves to the parsed JSON. */
function loadData(name) {
  const def = DATASETS[name];
  if (!def) return Promise.reject(new Error(`Unknown dataset: ${name}`));
  if (!dataPromises.has(name)) {
    const promise = fetch(def.url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${def.url}`);
        return res.json();
      })
      .then(json => {
        def.set(json);
        loadedDatasets.add(name);
        return json;
      })
      .catch(err => {
        dataPromises.delete(name); // allow retry on next navigation
        throw err;
      });
    dataPromises.set(name, promise);
  }
  return dataPromises.get(name);
}

function loadDatasets(names) {
  return Promise.all((names || []).map(loadData));
}
