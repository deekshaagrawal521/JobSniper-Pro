const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const cors = require('cors');
const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public')); // Your HTML/CSS lives here

// ✅ Improved Resume Analyzer
function analyzeResume(text) {
  const feedback = [];
  const lowerText = text.toLowerCase();

  if (lowerText.length < 200) {
    feedback.push("❗ Your resume seems too short. Try adding more content.");
  }

  if (!/experience|internship/.test(lowerText)) {
    feedback.push("🔍 Add a 'Work Experience' or 'Internship' section.");
  }
  if (!/project/.test(lowerText)) {
    feedback.push("💡 Include a 'Projects' section to showcase your work.");
  }
  if (!/skills?/.test(lowerText)) {
    feedback.push("🛠️ Add a 'Skills' section listing your technical abilities.");
  }
  if (!/education|qualification/.test(lowerText)) {
    feedback.push("🎓 Include your 'Education' or 'Qualifications'.");
  }
  if (!/github|linkedin|portfolio/.test(lowerText)) {
    feedback.push("🔗 Consider adding your GitHub, LinkedIn, or portfolio link.");
  }

  return feedback.length > 0 ? feedback.join('\n') : "✅ Your resume looks well-structured!";
}

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    let resumeText = '';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      resumeText = data.text;
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      resumeText = result.value;
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Unsupported file format. Please upload PDF or DOCX.' });
    }

    console.log("📄 Extracted Resume Text:\n", resumeText); // Debug log

    const feedback = analyzeResume(resumeText);
    fs.unlinkSync(file.path); // Delete uploaded file
    res.json({ feedback });

  } catch (err) {
    console.error("❌ Error analyzing resume:", err);
    res.status(500).json({ error: 'Something went wrong while analyzing the resume.' });
  }
});

app.listen(5000, () => {
  console.log('✅ Server running at http://localhost:5000');
});
