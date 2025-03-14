
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { ResumeData } from '@/pages/Editor';

interface ResumePreviewProps {
  resumeData: ResumeData;
  editable: boolean;
  onUpdate: (updatedData: ResumeData) => void;
}

const ResumePreview = ({ resumeData, editable, onUpdate }: ResumePreviewProps) => {
  const handlePersonalInfoChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    if (!editable) return;
    
    const updatedData = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    };
    
    onUpdate(updatedData);
  };
  
  const handleSummaryChange = (value: string) => {
    if (!editable) return;
    
    const updatedData = {
      ...resumeData,
      summary: value
    };
    
    onUpdate(updatedData);
  };
  
  const handleWorkExperienceChange = (index: number, field: keyof ResumeData['workExperience'][0], value: string) => {
    if (!editable) return;
    
    const updatedExperiences = [...resumeData.workExperience];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    
    const updatedData = {
      ...resumeData,
      workExperience: updatedExperiences
    };
    
    onUpdate(updatedData);
  };
  
  const addWorkExperience = () => {
    if (!editable) return;
    
    const newExperience = {
      title: '',
      company: '',
      period: '',
      description: ''
    };
    
    const updatedData = {
      ...resumeData,
      workExperience: [...resumeData.workExperience, newExperience]
    };
    
    onUpdate(updatedData);
  };
  
  const removeWorkExperience = (index: number) => {
    if (!editable) return;
    
    const updatedExperiences = [...resumeData.workExperience];
    updatedExperiences.splice(index, 1);
    
    const updatedData = {
      ...resumeData,
      workExperience: updatedExperiences
    };
    
    onUpdate(updatedData);
  };
  
  const handleSkillChange = (index: number, value: string) => {
    if (!editable) return;
    
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = value;
    
    const updatedData = {
      ...resumeData,
      skills: updatedSkills
    };
    
    onUpdate(updatedData);
  };
  
  const addSkill = () => {
    if (!editable) return;
    
    const updatedData = {
      ...resumeData,
      skills: [...resumeData.skills, '']
    };
    
    onUpdate(updatedData);
  };
  
  const removeSkill = (index: number) => {
    if (!editable) return;
    
    const updatedSkills = [...resumeData.skills];
    updatedSkills.splice(index, 1);
    
    const updatedData = {
      ...resumeData,
      skills: updatedSkills
    };
    
    onUpdate(updatedData);
  };
  
  const handleEducationChange = (index: number, field: keyof ResumeData['education'][0], value: string) => {
    if (!editable) return;
    
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    const updatedData = {
      ...resumeData,
      education: updatedEducation
    };
    
    onUpdate(updatedData);
  };
  
  const addEducation = () => {
    if (!editable) return;
    
    const newEducation = {
      school: '',
      degree: '',
      period: ''
    };
    
    const updatedData = {
      ...resumeData,
      education: [...resumeData.education, newEducation]
    };
    
    onUpdate(updatedData);
  };
  
  const removeEducation = (index: number) => {
    if (!editable) return;
    
    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);
    
    const updatedData = {
      ...resumeData,
      education: updatedEducation
    };
    
    onUpdate(updatedData);
  };
  
  const handleLanguageChange = (index: number, value: string) => {
    if (!editable) return;
    
    const updatedLanguages = [...resumeData.languages];
    updatedLanguages[index] = value;
    
    const updatedData = {
      ...resumeData,
      languages: updatedLanguages
    };
    
    onUpdate(updatedData);
  };
  
  const addLanguage = () => {
    if (!editable) return;
    
    const updatedData = {
      ...resumeData,
      languages: [...resumeData.languages, '']
    };
    
    onUpdate(updatedData);
  };
  
  const removeLanguage = (index: number) => {
    if (!editable) return;
    
    const updatedLanguages = [...resumeData.languages];
    updatedLanguages.splice(index, 1);
    
    const updatedData = {
      ...resumeData,
      languages: updatedLanguages
    };
    
    onUpdate(updatedData);
  };

  return (
    <div className="resume-container">
      {/* Header with title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">職務経歴書</h1>
        <p className="text-gray-500 text-sm">作成日: {new Date().toLocaleDateString('ja-JP')}</p>
      </div>
      
      {/* Personal Information */}
      <section className="resume-section">
        <h2 className="resume-heading">個人情報</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="resume-field">
            <div className="resume-field-label">氏名</div>
            {editable ? (
              <Input
                value={resumeData.personalInfo.name}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                className="resume-field-content"
              />
            ) : (
              <div className="resume-field-content">{resumeData.personalInfo.name}</div>
            )}
          </div>
          
          <div className="resume-field">
            <div className="resume-field-label">所在地</div>
            {editable ? (
              <Input
                value={resumeData.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                className="resume-field-content"
              />
            ) : (
              <div className="resume-field-content">{resumeData.personalInfo.location}</div>
            )}
          </div>
          
          <div className="resume-field">
            <div className="resume-field-label">Webサイト</div>
            {editable ? (
              <Input
                value={resumeData.personalInfo.website}
                onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                className="resume-field-content"
              />
            ) : (
              <div className="resume-field-content">{resumeData.personalInfo.website}</div>
            )}
          </div>
          
          <div className="resume-field">
            <div className="resume-field-label">連絡先</div>
            {editable ? (
              <Input
                value={resumeData.personalInfo.contact}
                onChange={(e) => handlePersonalInfoChange('contact', e.target.value)}
                className="resume-field-content"
              />
            ) : (
              <div className="resume-field-content">{resumeData.personalInfo.contact}</div>
            )}
          </div>
        </div>
      </section>
      
      {/* Summary */}
      <section className="resume-section">
        <h2 className="resume-heading">職務要約</h2>
        
        {editable ? (
          <Textarea
            value={resumeData.summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="resume-field-content w-full min-h-[100px]"
          />
        ) : (
          <div className="resume-field-content">{resumeData.summary}</div>
        )}
      </section>
      
      {/* Work Experience */}
      <section className="resume-section">
        <h2 className="resume-heading">職務経歴</h2>
        
        {resumeData.workExperience.map((experience, index) => (
          <motion.div 
            key={index} 
            className="mb-6 relative"
            initial={editable ? { opacity: 0, y: 20 } : {}}
            animate={editable ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            {editable && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -right-10 top-0"
                onClick={() => removeWorkExperience(index)}
              >
                <Trash size={16} />
              </Button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div className="resume-field">
                <div className="resume-field-label">職位</div>
                {editable ? (
                  <Input
                    value={experience.title}
                    onChange={(e) => handleWorkExperienceChange(index, 'title', e.target.value)}
                    className="resume-field-content"
                  />
                ) : (
                  <div className="resume-field-content">{experience.title}</div>
                )}
              </div>
              
              <div className="resume-field">
                <div className="resume-field-label">会社名</div>
                {editable ? (
                  <Input
                    value={experience.company}
                    onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                    className="resume-field-content"
                  />
                ) : (
                  <div className="resume-field-content">{experience.company}</div>
                )}
              </div>
              
              <div className="resume-field">
                <div className="resume-field-label">期間</div>
                {editable ? (
                  <Input
                    value={experience.period}
                    onChange={(e) => handleWorkExperienceChange(index, 'period', e.target.value)}
                    className="resume-field-content"
                  />
                ) : (
                  <div className="resume-field-content">{experience.period}</div>
                )}
              </div>
            </div>
            
            <div className="resume-field">
              <div className="resume-field-label">業務内容</div>
              {editable ? (
                <Textarea
                  value={experience.description}
                  onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                  className="resume-field-content w-full min-h-[80px]"
                />
              ) : (
                <div className="resume-field-content">{experience.description}</div>
              )}
            </div>
          </motion.div>
        ))}
        
        {editable && (
          <Button
            variant="outline"
            className="w-full mt-4 border-dashed border-gray-300 hover:border-resume-blue hover:bg-resume-blue/5"
            onClick={addWorkExperience}
          >
            <Plus size={16} className="mr-2" />
            職務経歴を追加
          </Button>
        )}
      </section>
      
      {/* Skills */}
      <section className="resume-section">
        <h2 className="resume-heading">スキル</h2>
        
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="relative group">
              {editable ? (
                <div className="flex items-center">
                  <Input
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="w-40"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 h-6 w-6 ml-1"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              ) : (
                <div className="bg-resume-gray px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </div>
              )}
            </div>
          ))}
          
          {editable && (
            <Button
              variant="outline"
              className="border-dashed border-gray-300 hover:border-resume-blue hover:bg-resume-blue/5"
              onClick={addSkill}
            >
              <Plus size={16} className="mr-1" />
              スキル追加
            </Button>
          )}
        </div>
      </section>
      
      {/* Education */}
      <section className="resume-section">
        <h2 className="resume-heading">学歴</h2>
        
        {resumeData.education.map((edu, index) => (
          <motion.div 
            key={index} 
            className="mb-4 relative"
            initial={editable ? { opacity: 0, y: 20 } : {}}
            animate={editable ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            {editable && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -right-10 top-0"
                onClick={() => removeEducation(index)}
              >
                <Trash size={16} />
              </Button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="resume-field">
                <div className="resume-field-label">学校名</div>
                {editable ? (
                  <Input
                    value={edu.school}
                    onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                    className="resume-field-content"
                  />
                ) : (
                  <div className="resume-field-content">{edu.school}</div>
                )}
              </div>
              
              <div className="resume-field">
                <div className="resume-field-label">学位・専攻</div>
                {editable ? (
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="resume-field-content"
                  />
                ) : (
                  <div className="resume-field-content">{edu.degree}</div>
                )}
              </div>
              
              <div className="resume-field">
                <div className="resume-field-label">期間</div>
                {editable ? (
                  <Input
                    value={edu.period}
                    onChange={(e) => handleEducationChange(index, 'period', e.target.value)}
                    className="resume-field-content"
                  />
                ) : (
                  <div className="resume-field-content">{edu.period}</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {editable && (
          <Button
            variant="outline"
            className="w-full mt-2 border-dashed border-gray-300 hover:border-resume-blue hover:bg-resume-blue/5"
            onClick={addEducation}
          >
            <Plus size={16} className="mr-2" />
            学歴を追加
          </Button>
        )}
      </section>
      
      {/* Languages */}
      <section className="resume-section">
        <h2 className="resume-heading">言語</h2>
        
        <div className="flex flex-wrap gap-2">
          {resumeData.languages.map((language, index) => (
            <div key={index} className="relative group">
              {editable ? (
                <div className="flex items-center">
                  <Input
                    value={language}
                    onChange={(e) => handleLanguageChange(index, e.target.value)}
                    className="w-40"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 h-6 w-6 ml-1"
                    onClick={() => removeLanguage(index)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              ) : (
                <div className="bg-resume-gray px-3 py-1 rounded-full text-sm font-medium">
                  {language}
                </div>
              )}
            </div>
          ))}
          
          {editable && (
            <Button
              variant="outline"
              className="border-dashed border-gray-300 hover:border-resume-blue hover:bg-resume-blue/5"
              onClick={addLanguage}
            >
              <Plus size={16} className="mr-1" />
              言語追加
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResumePreview;
