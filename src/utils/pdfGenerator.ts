
import { ResumeData } from '@/pages/Editor';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Note: In a real implementation, we would need to add proper Japanese font support
// This is a simplified version that works with basic Latin characters
export const generatePdf = async (resumeData: ResumeData): Promise<void> => {
  console.log('Generating PDF with data:', resumeData);
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Set document properties
  doc.setProperties({
    title: `職務経歴書_${resumeData.personalInfo.name}`,
    subject: '職務経歴書',
    author: resumeData.personalInfo.name,
    creator: '職務経歴書ジェネレーター',
  });
  
  // In a real implementation, we would load and use a Japanese font here
  // For simplicity, we'll use the default font for this demo
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('職務経歴書', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  // Add creation date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('ja-JP');
  doc.text(`作成日: ${currentDate}`, doc.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
  
  // Add personal information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('個人情報', 20, 40);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`氏名: ${resumeData.personalInfo.name}`, 20, 50);
  doc.text(`所在地: ${resumeData.personalInfo.location}`, 20, 57);
  doc.text(`連絡先: ${resumeData.personalInfo.contact}`, 20, 64);
  
  if (resumeData.personalInfo.website) {
    doc.text(`Webサイト: ${resumeData.personalInfo.website}`, 20, 71);
  }
  
  // Add summary
  let currentY = resumeData.personalInfo.website ? 85 : 78;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('職務要約', 20, currentY);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Split summary into multiple lines if needed
  const summaryLines = doc.splitTextToSize(resumeData.summary, 170);
  doc.text(summaryLines, 20, currentY + 10);
  
  currentY += 10 + (summaryLines.length * 7);
  
  // Add work experience
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('職務経歴', 20, currentY);
  
  currentY += 10;
  doc.setFontSize(11);
  
  for (const exp of resumeData.workExperience) {
    // Check if we need to add a new page
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${exp.title} - ${exp.company}`, 20, currentY);
    
    doc.setFont('helvetica', 'italic');
    doc.text(exp.period, 20, currentY + 7);
    
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(exp.description, 170);
    doc.text(descLines, 20, currentY + 14);
    
    currentY += 14 + (descLines.length * 7) + 5;
  }
  
  // Add skills
  // Check if we need to add a new page
  if (currentY > 260) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('スキル', 20, currentY);
  
  currentY += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Format skills as a comma-separated list
  const skillsText = resumeData.skills.join(', ');
  const skillsLines = doc.splitTextToSize(skillsText, 170);
  doc.text(skillsLines, 20, currentY);
  
  currentY += (skillsLines.length * 7) + 10;
  
  // Add education
  // Check if we need to add a new page
  if (currentY > 260) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('学歴', 20, currentY);
  
  currentY += 10;
  doc.setFontSize(11);
  
  for (const edu of resumeData.education) {
    // Check if we need to add a new page
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(edu.school, 20, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`${edu.degree} (${edu.period})`, 20, currentY + 7);
    
    currentY += 15;
  }
  
  // Add languages
  // Check if we need to add a new page
  if (currentY > 260) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('言語', 20, currentY);
  
  currentY += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Format languages as a comma-separated list
  const languagesText = resumeData.languages.join(', ');
  doc.text(languagesText, 20, currentY);
  
  // Save the PDF
  doc.save(`職務経歴書_${resumeData.personalInfo.name}_${currentDate}.pdf`);
};
