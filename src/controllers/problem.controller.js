const Problem = require('../models/Problem');
const Testcase = require('../models/Testcase');

exports.createProblem = async (req, res) => {
  try {
    // Only Admin/Organization should create (TODO: RBAC)
    const { title, description, difficulty, tags, sampleTestCases, testcases } = req.body;
    
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const problem = new Problem({
      title,
      slug,
      description,
      difficulty,
      tags,
      sampleTestCases
    });

    await problem.save();

    // Create Testcases
    if (testcases && testcases.length > 0) {
      const tcDocs = testcases.map(tc => ({
        problemId: problem._id,
        input: tc.input,
        expectedOutput: tc.output,
        isPublic: false
      }));
      await Testcase.insertMany(tcDocs);
    }

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, 'title slug difficulty tags');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProblemBySlug = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
