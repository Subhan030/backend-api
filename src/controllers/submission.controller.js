const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const Testcase = require('../models/Testcase');
const judgeService = require('../services/judge.service');

exports.submitCode = async (req, res) => {
  try {
    const { problemId, code, languageId } = req.body;
    const userId = req.user.id;

    // 1. Validate Problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // 2. Create Pending Submission
    const submission = new Submission({
      userId,
      problemId,
      code,
      languageId,
      status: 'Pending'
    });
    await submission.save();

    // 3. Fetch Test Cases
    const testcases = await Testcase.find({ problemId });
    if (testcases.length === 0) {
      submission.status = 'Internal Error';
      submission.errorMessage = 'No test cases found for this problem';
      await submission.save();
      return res.status(500).json({ message: 'No test cases found' });
    }

    // 4. Prepare Batch Submission for Judge0
    const judgeSubmissions = testcases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.expectedOutput,
      cpu_time_limit: tc.timeLimit,
      memory_limit: tc.memoryLimit
    }));

    // 5. Execute on Judge0
    const results = await judgeService.executeBatch(judgeSubmissions);

    // 6. Analyze Results
    let finalStatus = 'Accepted';
    let maxRuntime = 0;
    let maxMemory = 0;
    let firstError = null;

    for (const result of results) {
      // Status ID 3 is Accepted
      if (result.status.id !== 3) {
        finalStatus = result.status.description;
        firstError = result.stderr || result.compile_output || result.message;
        break; 
      }
      if (result.time > maxRuntime) maxRuntime = result.time;
      if (result.memory > maxMemory) maxMemory = result.memory;
    }

    // 7. Update Submission Record
    submission.status = finalStatus;
    submission.runtime = maxRuntime;
    submission.memory = maxMemory;
    submission.errorMessage = firstError;
    await submission.save();

    res.status(201).json(submission);

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Server error during submission processing' });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate('problemId', 'title')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
