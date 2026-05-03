from database import SessionLocal
from models import FAQ, ElectionEvent, PollingBooth, Candidate, Notice, QuizQuestion, User
from auth_utils import hash_password
from datetime import datetime, timedelta

def seed_all():
    db = SessionLocal()
    try:
        if db.query(FAQ).count() == 0:
            seed_faqs(db)
        if db.query(ElectionEvent).count() == 0:
            seed_events(db)
        if db.query(PollingBooth).count() == 0:
            seed_booths(db)
        if db.query(Candidate).count() == 0:
            seed_candidates(db)
        if db.query(Notice).count() == 0:
            seed_notices(db)
        if db.query(QuizQuestion).count() == 0:
            seed_quiz(db)
        if db.query(User).count() == 0:
            seed_admin(db)
        db.commit()
    finally:
        db.close()

def seed_admin(db):
    admin = User(
        name="Admin User",
        email="admin@electionassistant.in",
        hashed_password=hash_password("Admin@1234"),
        role="admin",
        language="en",
        state="Delhi",
        is_active=True
    )
    db.add(admin)

def seed_faqs(db):
    faqs = [
        FAQ(question="What is the minimum age to vote in India?", question_hi="भारत में मतदान की न्यूनतम आयु क्या है?",
            answer="The minimum age to vote in India is 18 years. You must be at least 18 years old on the qualifying date (January 1st of the year of the electoral roll revision) to be eligible to register as a voter.",
            answer_hi="भारत में मतदान की न्यूनतम आयु 18 वर्ष है। मतदाता सूची संशोधन के वर्ष की 1 जनवरी को आपकी आयु कम से कम 18 वर्ष होनी चाहिए।",
            category="eligibility", tags="age,eligibility,minimum,voter", views=245, helpful_count=189),

        FAQ(question="What documents do I need to register as a voter?", question_hi="मतदाता के रूप में पंजीकरण के लिए मुझे कौन से दस्तावेज़ चाहिए?",
            answer="Documents required: (1) Proof of Age: Birth certificate, Class 10 marksheet, Aadhaar, PAN, Passport, or Driving License. (2) Proof of Address: Aadhaar, Passport, utility bills, bank passbook, or rent agreement. (3) Recent passport-size photograph.",
            answer_hi="आवश्यक दस्तावेज़: (1) आयु प्रमाण: जन्म प्रमाण पत्र, 10वीं की मार्कशीट, आधार, पैन, पासपोर्ट या ड्राइविंग लाइसेंस। (2) पता प्रमाण: आधार, पासपोर्ट, उपयोगिता बिल, बैंक पासबुक। (3) हाल की पासपोर्ट आकार की फोटो।",
            category="documents", tags="documents,registration,aadhaar,proof", views=312, helpful_count=256),

        FAQ(question="How do I register to vote online?", question_hi="मैं ऑनलाइन मतदाता पंजीकरण कैसे करूं?",
            answer="To register online: (1) Visit nvsp.in or voters.eci.gov.in. (2) Click 'New Voter Registration'. (3) Fill Form 6 with personal details. (4) Upload required documents. (5) Submit and note your reference number. (6) Track status online. The process takes 30-45 days.",
            answer_hi="ऑनलाइन पंजीकरण के लिए: (1) nvsp.in या voters.eci.gov.in पर जाएं। (2) 'नया मतदाता पंजीकरण' पर क्लिक करें। (3) व्यक्तिगत विवरण के साथ फॉर्म 6 भरें। (4) आवश्यक दस्तावेज़ अपलोड करें। प्रक्रिया में 30-45 दिन लगते हैं।",
            category="registration", tags="online,nvsp,form6,registration", views=428, helpful_count=390),

        FAQ(question="What is EPIC card?", question_hi="EPIC कार्ड क्या है?",
            answer="EPIC stands for Electors Photo Identity Card, commonly known as the Voter ID card. It is issued by the Election Commission of India to all registered voters. It serves as both proof of identity and voter registration. You can use it at polling booths to cast your vote.",
            answer_hi="EPIC का मतलब है इलेक्टर्स फोटो आइडेंटिटी कार्ड, जिसे आमतौर पर वोटर आईडी कार्ड कहा जाता है। यह भारत के चुनाव आयोग द्वारा सभी पंजीकृत मतदाताओं को जारी किया जाता है।",
            category="registration", tags="epic,voter id,card,identity", views=198, helpful_count=167),

        FAQ(question="Can I vote without a Voter ID card?", question_hi="क्या मैं मतदाता पहचान पत्र के बिना मतदान कर सकता हूं?",
            answer="Yes! Even without a Voter ID card, you can vote if your name is on the electoral roll. You can use alternative photo ID documents such as: Aadhaar Card, MNREGA Job Card, Passbook with photo issued by Bank/Post Office, Health Insurance Smart Card, Driving License, PAN Card, Smart Card issued by RGI, Indian Passport, or Pension document with photo.",
            answer_hi="हां! मतदाता पहचान पत्र के बिना भी आप मतदान कर सकते हैं यदि आपका नाम मतदाता सूची में है। वैकल्पिक फोटो ID दस्तावेज़: आधार कार्ड, MNREGA जॉब कार्ड, पासबुक, ड्राइविंग लाइसेंस, पैन कार्ड, पासपोर्ट।",
            category="voting", tags="voting without id,alternative id,aadhaar", views=356, helpful_count=301),

        FAQ(question="What is EVM? Is it secure?", question_hi="EVM क्या है? क्या यह सुरक्षित है?",
            answer="EVM (Electronic Voting Machine) is a portable electronic device used in Indian elections since 1982. It consists of a Control Unit (with polling officer) and a Balloting Unit (with voter). EVMs are manufactured by BEL and ECIL, are stand-alone machines (not connected to internet/network), and have been upheld as secure by the Supreme Court of India multiple times.",
            answer_hi="EVM (इलेक्ट्रॉनिक वोटिंग मशीन) 1982 से भारतीय चुनावों में उपयोग किया जाने वाला एक पोर्टेबल इलेक्ट्रॉनिक उपकरण है। EVM BEL और ECIL द्वारा निर्मित हैं और इंटरनेट/नेटवर्क से जुड़े नहीं हैं।",
            category="evm", tags="evm,electronic voting,security,machine", views=289, helpful_count=234),

        FAQ(question="What is VVPAT?", question_hi="VVPAT क्या है?",
            answer="VVPAT (Voter Verifiable Paper Audit Trail) is an independent printer attached to EVMs that allows voters to verify their vote. After pressing the button on EVM, a paper slip prints showing the candidate's name and symbol, which is visible for 7 seconds before dropping into a sealed box. This ensures transparency and auditability of elections.",
            answer_hi="VVPAT (वोटर वेरिफाइएबल पेपर ऑडिट ट्रेल) EVM से जुड़ा एक स्वतंत्र प्रिंटर है जो मतदाताओं को अपना वोट सत्यापित करने की अनुमति देता है। बटन दबाने के बाद उम्मीदवार का नाम और चिह्न दिखाने वाली पर्ची 7 सेकंड तक दिखती है।",
            category="evm", tags="vvpat,paper trail,verification", views=201, helpful_count=178),

        FAQ(question="What is NOTA?", question_hi="NOTA क्या है?",
            answer="NOTA stands for 'None of the Above'. It was introduced in 2013 following a Supreme Court order. It allows voters to reject all candidates on the ballot. The NOTA button is the last option on EVM. If NOTA gets the highest votes, the candidate with the second highest votes wins (as per current rules). It promotes voter expression without spoiling the ballot.",
            answer_hi="NOTA का मतलब है 'इनमें से कोई नहीं'। यह 2013 में सुप्रीम कोर्ट के आदेश के बाद शुरू किया गया था। यह मतदाताओं को मतपत्र पर सभी उम्मीदवारों को अस्वीकार करने की अनुमति देता है।",
            category="voting", tags="nota,none of above,reject,ballot", views=267, helpful_count=219),

        FAQ(question="How do I find my polling booth?", question_hi="मैं अपना मतदान केंद्र कैसे खोजूं?",
            answer="You can find your polling booth through: (1) Visit voters.eci.gov.in and search by EPIC number or personal details. (2) Download Voter Helpline App. (3) Send SMS 'ECIVOTE' to 1950. (4) Call helpline 1950. (5) Visit your local Electoral Registration Office (ERO). Your voter slip will also mention the booth number.",
            answer_hi="मतदान केंद्र खोजने के लिए: (1) voters.eci.gov.in पर जाएं। (2) Voter Helpline App डाउनलोड करें। (3) 1950 पर SMS 'ECIVOTE' भेजें। (4) हेल्पलाइन 1950 पर कॉल करें।",
            category="voting", tags="polling booth,find booth,location", views=334, helpful_count=289),

        FAQ(question="What is Model Code of Conduct?", question_hi="आदर्श आचार संहिता क्या है?",
            answer="The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission of India for political parties and candidates during elections. It comes into force from the date of announcement of election schedule and remains in effect till the date of results. Key provisions: No use of religion/caste for votes, no promise of freebies, no derogatory language against opponents, government resources not to be misused for campaigning.",
            answer_hi="आदर्श आचार संहिता (MCC) चुनाव आयोग द्वारा राजनीतिक दलों और उम्मीदवारों के लिए दिशानिर्देशों का एक सेट है। यह चुनाव कार्यक्रम की घोषणा की तारीख से लागू होती है।",
            category="conduct", tags="mcc,code of conduct,rules,campaign", views=156, helpful_count=134),

        FAQ(question="How to file an election complaint?", question_hi="चुनाव शिकायत कैसे दर्ज करें?",
            answer="You can file election complaints through: (1) National Voter Helpline: 1950. (2) cVIGIL app - for live reporting of MCC violations with photo/video. (3) SARANSH portal on ECI website. (4) Directly to District Election Officer or Returning Officer. (5) Written complaint to Chief Electoral Officer of your state. Complaints are typically addressed within 100 minutes through cVIGIL.",
            answer_hi="चुनाव शिकायत दर्ज करने के तरीके: (1) राष्ट्रीय मतदाता हेल्पलाइन: 1950। (2) cVIGIL ऐप। (3) ECI वेबसाइट पर SARANSH पोर्टल। (4) जिला निर्वाचन अधिकारी को सीधे।",
            category="complaint", tags="complaint,grievance,cvigil,1950", views=223, helpful_count=198),

        FAQ(question="What is postal ballot?", question_hi="पोस्टल बैलट क्या है?",
            answer="Postal ballot allows certain categories of voters to vote by post without physically visiting the polling booth. Eligible categories include: Service voters (armed forces, police), persons with disabilities (PWD), essential services personnel (on duty on election day), voters above 85 years of age, and COVID-19 affected persons. They can apply for postal ballot through Form 12D submitted to Returning Officer.",
            answer_hi="पोस्टल बैलट कुछ श्रेणी के मतदाताओं को मतदान केंद्र पर जाए बिना डाक द्वारा मतदान करने की अनुमति देता है। पात्र: सेवा मतदाता, विकलांग व्यक्ति, 85 वर्ष से अधिक के मतदाता।",
            category="voting", tags="postal ballot,absentee,service voter,disabled", views=145, helpful_count=123),
    ]
    db.add_all(faqs)

def seed_events(db):
    base = datetime.now()
    events = [
        ElectionEvent(title="Voter Roll Revision Period", title_hi="मतदाता सूची संशोधन काल",
            description="Annual revision of electoral rolls. Last date to apply for new registration is January 1st qualifying date.",
            description_hi="मतदाता सूचियों का वार्षिक संशोधन।",
            event_date=base + timedelta(days=15), event_type="registration", is_national=True),
        ElectionEvent(title="Bihar Legislative Assembly Elections", title_hi="बिहार विधानसभा चुनाव",
            description="Phase 1 of Bihar Legislative Assembly Elections 2025.",
            event_date=base + timedelta(days=45), event_type="assembly_election", state="Bihar", is_national=False),
        ElectionEvent(title="Last Date for Voter Registration", title_hi="मतदाता पंजीकरण की अंतिम तिथि",
            description="Last date to submit Form 6 for voter registration before upcoming elections.",
            description_hi="आगामी चुनावों से पहले मतदाता पंजीकरण के लिए फॉर्म 6 जमा करने की अंतिम तिथि।",
            event_date=base + timedelta(days=30), event_type="deadline", is_national=True),
        ElectionEvent(title="Delhi Municipal Corporation Elections", title_hi="दिल्ली नगर निगम चुनाव",
            description="MCD elections scheduled for municipal ward representatives.",
            event_date=base + timedelta(days=60), event_type="local_election", state="Delhi", is_national=False),
        ElectionEvent(title="Model Code of Conduct Announcement", title_hi="आदर्श आचार संहिता घोषणा",
            description="Election Commission announces election schedule and Model Code of Conduct comes into force.",
            event_date=base + timedelta(days=40), event_type="announcement", is_national=True),
        ElectionEvent(title="Last Date for Nomination Filing", title_hi="नामांकन दाखिल करने की अंतिम तिथि",
            description="Candidates must file their nomination papers by this date.",
            event_date=base + timedelta(days=52), event_type="nomination", is_national=False, state="Bihar"),
        ElectionEvent(title="Polling Day - Bihar Phase 1", title_hi="मतदान दिवस - बिहार चरण 1",
            description="Polling for Phase 1 constituencies. Polling hours: 7 AM to 6 PM.",
            event_date=base + timedelta(days=58), event_type="polling_day", state="Bihar", is_national=False),
        ElectionEvent(title="Vote Counting & Results", title_hi="मत गणना और परिणाम",
            description="Counting of votes and declaration of results.",
            event_date=base + timedelta(days=72), event_type="results", state="Bihar", is_national=False),
    ]
    db.add_all(events)

def seed_booths(db):
    booths = [
        PollingBooth(name="Government Primary School, Sector 15", address="Sector 15, Near Post Office, New Delhi - 110075", state="Delhi", district="South Delhi", constituency="New Delhi", booth_number="001", latitude=28.6139, longitude=77.2090, capacity=1200, is_accessible=True),
        PollingBooth(name="Municipal Bal Vidyalaya, Block A", address="Block A, Lajpat Nagar III, New Delhi - 110024", state="Delhi", district="South Delhi", constituency="Greater Kailash", booth_number="045", latitude=28.5708, longitude=77.2420, capacity=900, is_accessible=True),
        PollingBooth(name="Community Hall, Dwarka Sector 6", address="Sector 6, Dwarka, New Delhi - 110075", state="Delhi", district="West Delhi", constituency="Dwarka", booth_number="112", latitude=28.5921, longitude=77.0460, capacity=1100, is_accessible=False),
        PollingBooth(name="Sarvodaya Kanya Vidyalaya", address="Mayur Vihar Phase 1, Delhi - 110091", state="Delhi", district="East Delhi", constituency="Trilokpuri", booth_number="078", latitude=28.6128, longitude=77.2970, capacity=800, is_accessible=True),
        PollingBooth(name="Ramlila Maidan Community Center", address="Near Ramlila Maidan, Old Delhi - 110006", state="Delhi", district="Central Delhi", constituency="Chandni Chowk", booth_number="023", latitude=28.6563, longitude=77.2354, capacity=1500, is_accessible=True),
        PollingBooth(name="Government Boys Senior Secondary School", address="Patna City, Patna - 800008", state="Bihar", district="Patna", constituency="Patna Sahib", booth_number="056", latitude=25.5941, longitude=85.1376, capacity=1000, is_accessible=True),
        PollingBooth(name="Panchayat Bhawan, Village Rampur", address="Village Rampur, Ara, Bhojpur - 802301", state="Bihar", district="Bhojpur", constituency="Ara", booth_number="034", latitude=25.5569, longitude=84.6740, capacity=600, is_accessible=False),
        PollingBooth(name="Zila Parishad Hall", address="Civil Lines, Lucknow - 226001", state="Uttar Pradesh", district="Lucknow", constituency="Lucknow", booth_number="089", latitude=26.8467, longitude=80.9462, capacity=1300, is_accessible=True),
    ]
    db.add_all(booths)

def seed_candidates(db):
    candidates = [
        Candidate(name="Rajesh Kumar Sharma", party="Indian National Party", constituency="New Delhi", state="Delhi", education="M.A. Political Science, Delhi University", age=52, criminal_cases=0, assets="₹2.5 Crore", manifesto_summary="Focus on infrastructure development, education reform, and employment generation for youth in Delhi.", image_url="https://i.pravatar.cc/150?img=1"),
        Candidate(name="Priya Anand", party="Progressive Democratic Front", constituency="New Delhi", state="Delhi", education="LLB, Faculty of Law, DU", age=41, criminal_cases=0, assets="₹1.8 Crore", manifesto_summary="Women's safety, public transport improvement, air quality control, and accessible healthcare.", image_url="https://i.pravatar.cc/150?img=5"),
        Candidate(name="Mohammed Iqbal Khan", party="People's Alliance", constituency="New Delhi", state="Delhi", education="B.Com, SRCC", age=48, criminal_cases=1, assets="₹3.2 Crore", manifesto_summary="Minority rights, small business support, housing for all, and improved drainage infrastructure.", image_url="https://i.pravatar.cc/150?img=3"),
        Candidate(name="Sunita Devi", party="Janata Seva Party", constituency="Greater Kailash", state="Delhi", education="B.A. Economics", age=45, criminal_cases=0, assets="₹1.1 Crore", manifesto_summary="Water supply, parks and green spaces, senior citizen facilities, and school upgrades.", image_url="https://i.pravatar.cc/150?img=9"),
        Candidate(name="Arvind Pratap Singh", party="Rashtriya Jan Morcha", constituency="Patna Sahib", state="Bihar", education="B.Tech, IIT Patna", age=38, criminal_cases=0, assets="₹4.5 Crore", manifesto_summary="Industrial development in Bihar, job creation, flood management, and healthcare infrastructure.", image_url="https://i.pravatar.cc/150?img=7"),
        Candidate(name="Mamta Kumari", party="Lok Shakti Dal", constituency="Patna Sahib", state="Bihar", education="M.Sc. Agriculture", age=44, criminal_cases=0, assets="₹0.9 Crore", manifesto_summary="Farmer welfare, agricultural loan waiver, rural electrification, and women empowerment schemes.", image_url="https://i.pravatar.cc/150?img=10"),
    ]
    db.add_all(candidates)

def seed_notices(db):
    notices = [
        Notice(title="Voter List Published for 2025 Revision", title_hi="2025 संशोधन के लिए मतदाता सूची प्रकाशित",
               content="The draft electoral roll for 2025 has been published. Citizens can check their names and submit claims/objections from January 1 to January 31, 2025. Visit your local ERO or nvsp.in.",
               content_hi="2025 के लिए मसौदा मतदाता सूची प्रकाशित की गई है। नागरिक अपना नाम जांच सकते हैं।",
               notice_type="important", priority="high"),
        Notice(title="New Voter Registration Drive Launched", title_hi="नया मतदाता पंजीकरण अभियान शुरू",
               content="The Election Commission of India has launched a special voter registration drive for first-time voters aged 18-19 years. Register online at nvsp.in or visit nearest ERO.",
               content_hi="भारत निर्वाचन आयोग ने 18-19 वर्ष के पहली बार मतदाताओं के लिए विशेष पंजीकरण अभियान शुरू किया है।",
               notice_type="campaign", priority="normal"),
        Notice(title="Helpline 1950 Now Available 24/7", title_hi="हेल्पलाइन 1950 अब 24/7 उपलब्ध",
               content="The National Voter Helpline 1950 is now operational 24 hours a day, 7 days a week for election-related queries and grievances.",
               content_hi="राष्ट्रीय मतदाता हेल्पलाइन 1950 अब 24 घंटे, सप्ताह के 7 दिन चुनाव संबंधी प्रश्नों के लिए उपलब्ध है।",
               notice_type="service", priority="normal"),
        Notice(title="cVIGIL App for MCC Violation Reporting", title_hi="MCC उल्लंघन रिपोर्टिंग के लिए cVIGIL ऐप",
               content="Citizens can now report Model Code of Conduct violations using the cVIGIL app. Download from Play Store or App Store. Reports are resolved within 100 minutes.",
               notice_type="announcement", priority="high"),
    ]
    db.add_all(notices)

def seed_quiz(db):
    questions = [
        QuizQuestion(question="What is the minimum voting age in India?", option_a="16 years", option_b="18 years", option_c="21 years", option_d="25 years", correct_answer="B", explanation="The Constitution of India (Article 326) sets the minimum voting age at 18 years, reduced from 21 years by the 61st Constitutional Amendment in 1988.", difficulty="easy", category="eligibility"),
        QuizQuestion(question="Which form is used for new voter registration in India?", option_a="Form 4", option_b="Form 6", option_c="Form 8", option_d="Form 7", correct_answer="B", explanation="Form 6 is used for new voter registration. Form 7 is for deletion, Form 8 is for correction of entries.", difficulty="medium", category="registration"),
        QuizQuestion(question="What does EPIC stand for?", option_a="Election Photo Identity Certificate", option_b="Electoral Photo Identity Card", option_c="Electors Photo Identity Card", option_d="Election Personnel Identity Card", correct_answer="C", explanation="EPIC stands for Electors Photo Identity Card, commonly known as the Voter ID card.", difficulty="easy", category="registration"),
        QuizQuestion(question="When was EVM first used in Indian general elections?", option_a="1989", option_b="1994", option_c="1998", option_d="2004", correct_answer="C", explanation="EVMs were first used in all constituencies in the 1998 general elections. They were piloted in select constituencies in 1982.", difficulty="hard", category="evm"),
        QuizQuestion(question="What is NOTA?", option_a="National Option for Total Abstention", option_b="None of the Above", option_c="National Online Tracking Application", option_d="No Official Tabulated Answer", correct_answer="B", explanation="NOTA (None of the Above) was introduced in 2013 following Supreme Court order in PUCL vs Union of India case.", difficulty="easy", category="voting"),
        QuizQuestion(question="How many constituencies are there in the Lok Sabha?", option_a="525", option_b="540", option_c="543", option_d="545", correct_answer="C", explanation="The Lok Sabha (House of the People) has 543 directly elected constituencies across India.", difficulty="medium", category="general"),
        QuizQuestion(question="What is the tenure of the President of India?", option_a="4 years", option_b="5 years", option_c="6 years", option_d="Till age 70", correct_answer="B", explanation="The President of India serves a term of 5 years, elected indirectly by elected members of Parliament and state legislatures.", difficulty="easy", category="general"),
        QuizQuestion(question="Which article of the Constitution provides for Universal Adult Suffrage?", option_a="Article 324", option_b="Article 325", option_c="Article 326", option_d="Article 327", correct_answer="C", explanation="Article 326 provides for elections to the House of the People and Legislative Assemblies on the basis of adult suffrage.", difficulty="hard", category="constitution"),
        QuizQuestion(question="What does VVPAT stand for?", option_a="Voter Verified Paper Audit Trail", option_b="Voter Verifiable Paper Audit Trail", option_c="Verified Voter Paper Authentication Trail", option_d="Voter Vote Paper Audit Track", correct_answer="B", explanation="VVPAT stands for Voter Verifiable Paper Audit Trail. It prints a paper slip showing the candidate voted for, visible for 7 seconds.", difficulty="medium", category="evm"),
        QuizQuestion(question="The Model Code of Conduct comes into force from?", option_a="Date of general notification", option_b="Date of nomination filing", option_c="Date of election schedule announcement", option_d="Date of polling", correct_answer="C", explanation="The Model Code of Conduct comes into force from the date of announcement of election schedule by the Election Commission.", difficulty="medium", category="conduct"),
        QuizQuestion(question="What is the helpline number for election-related queries?", option_a="1800", option_b="1920", option_c="1950", option_d="112", correct_answer="C", explanation="1950 is the National Voter Helpline for all election-related queries, complaints, and assistance.", difficulty="easy", category="general"),
        QuizQuestion(question="Postal ballot facility is available for which category?", option_a="Students studying abroad", option_b="Service voters and disabled persons", option_c="All voters above 60 years", option_d="NRI voters only", correct_answer="B", explanation="Postal ballot is available for service voters (armed forces, police), persons with disabilities, essential service workers, and voters above 85 years.", difficulty="hard", category="voting"),
    ]
    db.add_all(questions)
