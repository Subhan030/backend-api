const judgeService = require('../services/judge.service');

/**
 * Run code with custom input (no database save)
 * This is for testing purposes before submission
 */
exports.runCode = async (req, res) => {
  try {
    const { code, languageId, customInput } = req.body;

    if (!code || !languageId) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    // Execute on Judge0 using the same pattern as submission controller
    const result = await judgeService.execute(
      Buffer.from(code).toString('base64'),
      languageId,
      Buffer.from(customInput || '').toString('base64'),
      null // No expected output for custom runs
    );

    // Format response
    const formattedResponse = {
      status: result.status.description,
      statusId: result.status.id,
      stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8') : '',
      stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8') : '',
      compileOutput: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8') : '',
      time: result.time,
      memory: result.memory,
      message: result.message
    };

    res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ 
      message: 'Server error during code execution',
      error: error.message 
    });
  }
};
