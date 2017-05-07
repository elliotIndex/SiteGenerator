const {deepSet} = require('../js/utils.js');

// Tests
function it(testName, testFn) {
  try {
    if (testFn()) {
      console.log(testName, 'Passed');
    } else {
      console.log(testName, 'Failed');
    }
  } catch (error) {
    console.error(testName, 'Error', error);
  }
}

// Object building tests
it('Deep set on first level', () => {
  const path = 'puppers';
  const value = 'are cute';
  const setObj = deepSet({}, path, value);
  return setObj[path] === value;
});

// Object building tests
it('Deep set on second level', () => {
  const path = 'little.puppers';
  const value = 'are cute';
  const setObj = deepSet({}, path, value);
  return setObj.little.puppers === value;
});

// Object building tests
it('Deep set on third level', () => {
  const path = 'very.little.puppers';
  const value = 'are very cute';
  const setObj = deepSet({}, path, value);
  return setObj.very.little.puppers === value;
});

// Object building tests
it('Deep set two things', () => {
  const path1 = 'very.little.puppers';
  const path2 = 'very.little.kittums';
  const value1 = 'are very cute';
  const value2 = 'are very fun';
  const setObj = {};
  deepSet(setObj, path1, value1);
  deepSet(setObj, path2, value2);
  return setObj.very.little.puppers === value1 && setObj.very.little.kittums === value2;
});
