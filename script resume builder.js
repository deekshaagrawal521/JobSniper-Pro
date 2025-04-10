// Template selection listener
document.getElementById('template-selection').addEventListener('change', function () {
    const resumeOutput = document.getElementById('resume-output');
    resumeOutput.className = ''; // Clear existing classes
    resumeOutput.classList.add(`template-${this.value}`); // Apply selected template class
});

// Generate Resume Preview
document.getElementById('generate-resume').addEventListener('click', function () {
    // Get values from the form
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value;
    const projects = document.getElementById('projects').value;
    const achievements = document.getElementById('achievements').value;
    const experience = document.getElementById('experience').value;
    const education = document.getElementById('education').value;

    // Generate HTML for resume preview
    const resumeOutput = document.getElementById('resume-output');
    resumeOutput.innerHTML = `
        <h2>${name}</h2>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <h3>Summary</h3>
        <p>${summary}</p>
        <h3>Skills</h3>
        <p>${skills}</p>
        <h3>Projects</h3>
        <p>${projects}</p>
        <h3>Achievements</h3>
        <p>${achievements}</p>
        <h3>Work Experience</h3>
        <p>${experience}</p>
        <h3>Education</h3>
        <p>${education}</p>
    `;
});

// Download Resume as PDF
document.getElementById('download-pdf').addEventListener('click', function () {
    const element = document.getElementById('resume-output');
    
    // Options for HTML to PDF conversion
    const options = {
        margin: 1,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Convert the HTML to PDF
    html2pdf().set(options).from(element).save();
});
