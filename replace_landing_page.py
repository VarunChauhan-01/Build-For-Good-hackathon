import sys
import re

file_path = r"c:\Users\Jatin\OneDrive\Desktop\jeevansetuaiproject\Sama-Social-Hackathon-project\src\components\LandingPage.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    # Hero Section
    (r"Empowering Rural & Urban India", r"{t('heroTagline')}"),
    (r"India's First", r"{t('heroTitle1')}"),
    (r"Aadhaar-Verified", r"{t('heroTitle2')}"),
    (r"Voice Hiring Platform", r"{t('heroTitle3')}"),
    (r">Zero Scams<", r">{t('heroZeroScams')}<"),
    (r">Voice Registration<", r">{t('heroVoiceReg')}<"),
    (r">Jobs \+ Agriculture<", r">{t('heroJobsAgri')}<"),
    (r">Start Voice Registration<", r">{t('heroStartVoice')}<"),
    (r">Browse Local Jobs<", r">{t('heroBrowseJobs')}<"),
    
    # 1. Trust & Verification
    (r"🛡️ Trust & Verification System", r"🛡️ {t('trustSectionTitle')}"),
    (r'"Every worker and employer is verified to eliminate hiring scams and build trust."', r'"{t(\'trustSectionSubtitle\')}"'),
    (r">Worker Trust Score<", r">{t('workerTrustTitle')}<"),
    (r">Employer Trust Score<", r">{t('employerTrustTitle')}<"),
    (r">Score<", r">{t('scoreLabel')}<"),
    (r">Verified<", r">{t('verified')}<"),
    (r">Aadhaar Verified<", r">{t('aadhaarVerified')}<"),
    (r">Mobile Verified<", r">{t('mobileVerified')}<"),
    (r">Skill Verified<", r">{t('skillVerified')}<"),
    (r">Previous Work Verified<", r">{t('prevWorkVerified')}<"),
    (r">Positive Reviews<", r">{t('positiveReviews')}<"),
    (r">Premium Recruiter<", r">{t('premiumRecruiter')}<"),
    (r">GST Verified<", r">{t('gstVerified')}<"),
    (r">Business Verified<", r">{t('businessVerified')}<"),
    (r">Payment Verified<", r">{t('paymentVerified')}<"),
    (r">Trusted Recruiter Badge<", r">{t('trustedRecruiterBadge')}<"),
    
    # 2. Employment Challenges
    (r"📊 India's Employment Challenges", r"📊 {t('challengeTitle')}"),
    (r"'Lack Digital Profiles'", r"t('challengeLackProfiles')"),
    (r"'Informal workers struggle to showcase their skills online due to technological and literacy barriers.'", r"t('challengeLackProfilesDesc')"),
    (r"'Face Job Scams'", r"t('challengeJobScams')"),
    (r"'Unsuspecting rural workers are trapped by fake job offers demanding upfront recruitment charges.'", r"t('challengeJobScamsDesc')"),
    (r"'English Barrier'", r"t('challengeEnglishBarrier')"),
    (r"'Job-seeking rural workers lose out on opportunities because platforms support only English text.'", r"t('challengeEnglishBarrierDesc')"),
    (r"'Labour Shortages'", r"t('challengeLabourShortages')"),
    (r"'Farmers run out of labourers during peak harvest, leading to massive crop losses across regions.'", r"t('challengeLabourShortagesDesc')"),
    (r"'Millions'", r"t('challengeMillions')"),
    (r"'Seasonal'", r"t('challengeSeasonal')"),
    (r'"JeevanSetu solves these challenges through AI, Voice Technology, Government Verification, and Smart Employment Matching."', r'"{t(\'challengeQuote\')}"'),
    
    # 3. Smart Agriculture Network
    (r"🌾 Smart Agriculture Network", r"🌾 {t('agriTitle')}"),
    (r">Direct peer-to-peer agriculture marketplace matching farmers, machinery rentals, and labor at verified fair market rates.<", r">{t('agriSubtitle')}<"),
    (r"'Equipment Rental'", r"t('agriEquipmentTitle')"),
    (r"'Rent harvesters, tractors, sprayers directly from neighboring owners. Prevents peak-season rate manipulation.'", r"t('agriEquipmentDesc')"),
    (r"'Rent Equipment'", r"t('agriEquipmentAction')"),
    (r"'Farm Labour Hiring'", r"t('agriLabourTitle')"),
    (r"'Hire skilled harvesters, planters, and daily agricultural support easily with local distance parameters.'", r"t('agriLabourDesc')"),
    (r"'Hire Labourers'", r"t('agriLabourAction')"),
    (r"'Weather Forecasts'", r"t('agriWeatherTitle')"),
    (r"'Hyper-local weather warnings integrated with recommendations for harvesting schedules and pesticide application.'", r"t('agriWeatherDesc')"),
    (r"'Check Weather'", r"t('agriWeatherAction')"),
    (r"'Market Price Intelligence'", r"t('agriMarketTitle')"),
    (r"'Real-time daily grain, fruit, and vegetable pricing insights tracking fair retail and wholesale values.'", r"t('agriMarketDesc')"),
    (r"'View Pricing'", r"t('agriMarketAction')"),
    (r"'Crop Advisory'", r"t('agriCropTitle')"),
    (r"'AI chatbot advises on soil care, crop rotation, organic farming solutions, and common pest treatments.'", r"t('agriCropDesc')"),
    (r"'Get Advice'", r"t('agriCropAction')"),
    (r"'Nearby Mandi Information'", r"t('agriMandiTitle')"),
    (r"'Compare rates between multiple regional APMC Mandis to choose the best selling point for your harvest.'", r"t('agriMandiDesc')"),
    (r"'Find Mandis'", r"t('agriMandiAction')"),

    # Voice Language Section
    (r"🗣️ Speak In Your Language", r"🗣️ {t('voiceSectionTitle')}"),
    (r"🎙️ Interactive Voice Test", r"🎙️ {t('voiceTestTitle')}"),
    (r"'Listening for dialect\.\.\.'", r"t('voiceListeningDialect')"),
    (r"Recognized: ", r"${t('voiceRecognized')}: "),
    (r" - Redirecting\.\.\.", r" - ${t('voiceRedirecting')}"),
    (r"'Click the mic to speak in your language\.\.\.'", r"t('voiceClickMic')"),
    (r'"No typing required. Simply speak in your preferred language."', r'"{t(\'voiceNoTyping\')}"'),
    (r">Get Started with Voice<", r">{t('heroStartVoice')}<"),
    
    # AI Features
    (r"🤖 AI-Powered Features", r"🤖 {t('aiSectionTitle')}"),
    (r"'Voice Profile Creation'", r"t('aiVoiceProfile')"),
    (r"'Register profiles and resumes seamlessly by answering assistant voice prompts in regional dialects.'", r"t('aiVoiceProfileDesc')"),
    (r"'Smart Job Matching'", r"t('aiSmartMatch')"),
    (r"'Our semantic matchers connect workers to localized employment openings fitting their exact abilities.'", r"t('aiSmartMatchDesc')"),
    (r"'AI Scam Detection'", r"t('aiScamDetect')"),
    (r"'Real-time profile analyzing blocks potential scam patterns, overpricing habits, and dummy listings.'", r"t('aiScamDetectDesc')"),
    (r"'AI Resume Generation'", r"t('aiResume')"),
    (r"'Transform raw voice transcripts into structured resume credentials verified directly with Aadhaar.'", r"t('aiResumeDesc')"),
    (r"'Voice-Based Job Applications'", r"t('aiVoiceApply')"),
    (r"'Apply to jobs immediately with simple audio submissions. Perfect for illiterate and semi-literate users.'", r"t('aiVoiceApplyDesc')"),
    (r"'Career Growth Recommendations'", r"t('aiCareerGrowth')"),
    (r"'Calculates local job trends and recommends adjacent skills to upgrade worker income potentials.'", r"t('aiCareerGrowthDesc')"),
    (r"'Active'", r"t('badgeActive')"),
    (r"'Beta'", r"t('badgeBeta')"),

    # Digital Rozgaar Card
    (r"🪪 Digital Rozgaar Card", r"🪪 {t('cardSectionTitle')}"),
    (r">Verify Instantly with Secure QR Codes<", r">{t('cardVerifyQR')}<"),
    (r"Every worker receives a secure digital employment identity that can be instantly verified by employers through QR scanning.", r"{t('cardDesc1')}"),
    (r"This card combines Aadhaar validity status, a real-time calculated verification trust score, certified skills checklist, and experience counters. Employers scan the card on their phones to confirm the profile's legitimacy instantly without paperwork.", r"{t('cardDesc2')}"),
    (r">Generate My Card<", r">{t('cardGenerate')}<"),
    (r">Govt. Verified Worker Identity Card<", r">{t('cardGovtId')}<"),
    (r">AADHAAR OK<", r">{t('cardAadhaarOk')}<"),
    (r">Agriculture Specialist<", r">{t('cardAgriSpecialist')}<"),
    (r">EXP<", r">{t('cardExp')}<"),
    (r">6\+ Years<", r">{t('cardYears')}<"),
    (r">TRUST SCORE<", r">{t('cardTrustScoreLabel')}<"),
    (r">SKILLS<", r">{t('cardSkillsLabel')}<"),
    (r">Harvesting • Tractor Ops • Irrigation<", r">{t('cardSkillsList')}<"),
    
    # Potential National Impact
    (r">National Vision<", r">{t('impactVision')}<"),
    (r"🚀 Potential National Impact", r"🚀 {t('impactTitle')}"),
    (r"Building India's largest verified employment infrastructure for the informal workforce.", r"{t('impactSubtitle')}"),
    (r"'Workers Empowered'", r"t('impactWorkersLabel')"),
    (r"'Connecting daily laborers, painters, electricians and helpers to stable jobs.'", r"t('impactWorkersDesc')"),
    (r"'Farmers Connected'", r"t('impactFarmersLabel')"),
    (r"'Preventing situational crop overpricing and coordinating farm labour shortages.'", r"t('impactFarmersDesc')"),
    (r"'Employers Verified'", r"t('impactEmployersLabel')"),
    (r"'Eliminating job site fraud with GST checks and upfront payment guarantees.'", r"t('impactEmployersDesc')"),
    (r"'Indian Languages'", r"t('impactLanguagesLabel')"),
    (r"'Supporting regional dialects to make voice profile registration accessible.'", r"t('impactLanguagesDesc')"),
    (r"'Villages Covered'", r"t('impactVillagesLabel')"),
    (r"'Hyper-local geofencing lists local job openings within short walking ranges.'", r"t('impactVillagesDesc')"),
    (r"'Zero Scam'", r"t('impactZeroScam')"),
    (r"'Hiring Vision'", r"t('impactHiringVision')"),
    (r"'Platform backed by automatic three-strike reports and blacklist blockades.'", r"t('impactHiringVisionDesc')"),
    (r"'Thousands'", r"t('impactThousands')"),
    (r">Partnered with National Career Service \(NCS\)<", r">{t('impactNCS')}<"),
    (r">Aadhaar Identity API Sandboxed integration<", r">{t('impactAadhaarAPI')}<"),
    (r">Digital India Initiative Supporting Platform<", r">{t('impactDigitalIndia')}<"),

    # City Labels
    (r"'Delhi'", r"t('cityDelhi')"),
    (r"'Mumbai'", r"t('cityMumbai')"),
    (r"'Kolkata'", r"t('cityKolkata')"),
    (r"'Hyderabad'", r"t('cityHyderabad')"),
    (r"'Bengaluru'", r"t('cityBengaluru')"),

    # Cities render loop
    (r">Delhi<", r">{t('cityDelhi')}<"),
    (r">Mumbai<", r">{t('cityMumbai')}<"),
    (r">Kolkata<", r">{t('cityKolkata')}<"),
    (r">Hyderabad<", r">{t('cityHyderabad')}<"),
    (r">Bengaluru<", r">{t('cityBengaluru')}<"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replaced all static text successfully!")
