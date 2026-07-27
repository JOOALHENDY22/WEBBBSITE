export type Language = "en" | "ar";

type Dictionary = {
  [key: string]: {
    en: string;
    ar: string;
  };
};

export const dict: Dictionary = {
  // Home
  platformTitle: { en: "Pharmacy Students Platform", ar: "منصة طلاب صيدلة" },
  mainTitle: { en: "Mini Doctors", ar: "ميني دكتورز" },
  subtitle: { 
    en: "The ultimate testing platform designed exclusively for pharmacy students. Elevate your knowledge with interactive, real-time assessments.", 
    ar: "أجمد منصة امتحانات معمولة مخصوص لطلاب صيدلة. ظبط معلوماتك وامتحن في أي وقت وخد نتيجتك في ثواني!" 
  },
  exploreExams: { en: "Explore Exams", ar: "خش شوف الامتحانات" },
  adminPortal: { en: "Admin Portal", ar: "لوحة الإدارة" },

  // Exams List
  availableExams: { en: "Available Exams", ar: "الامتحانات اللي موجودة" },
  selectExamDesc: { en: "Select an exam to begin your assessment.", ar: "اختار امتحان عشان تبدأ وتختبر نفسك يا وحش." },
  backToHome: { en: "Back to Home", ar: "ارجع للرئيسية" },
  noExams: { en: "No Exams Available", ar: "مفيش امتحانات دلوقتي" },
  checkBackLater: { en: "Check back later for new assessments.", ar: "ابقى شيك تاني بعدين يمكن ينزل حاجة جديدة." },
  questions: { en: "Questions", ar: "سؤال" },
  notTimed: { en: "Not timed", ar: "بدون وقت" },
  startExam: { en: "Start Exam", ar: "ابدأ الامتحان" },

  // User Registration
  welcomeHero: { en: "Welcome aboard!", ar: "أهلاً بيك يا بطل!" },
  enterNameDesc: { 
    en: "This is your first time taking an exam. Enter your name to track your scores and compete on the leaderboard.", 
    ar: "دي أول مرة تدخل تمتحن، اكتب اسمك عشان نحفظ نتيجتك وتنافس على لوحة الأوائل." 
  },
  namePlaceholder: { en: "Enter your full name...", ar: "اكتب اسمك الحقيقي (ثلاثي)..." },
  registering: { en: "Registering...", ar: "بنسجل اسمك..." },
  letsStart: { en: "Let's Start", ar: "يلا نبدأ الإمتحان" },

  // Quiz Client
  progress: { en: "Progress", ar: "خلصت كام" },
  answeredOf: { en: "Answered {ans} of {total}", ar: "جاوبت {ans} من {total}" },
  trueOrFalse: { en: "True or False", ar: "صح ولا غلط" },
  submitScore: { en: "Submit & View Score", ar: "سلم وشوف نتيجتك" },
  processingResults: { en: "Processing Results...", ar: "بنحسب النتيجة..." },
  noQuestionsFound: { en: "No Questions Found", ar: "مفيش أسئلة هنا" },
  examNotSetUp: { en: "This exam hasn't been set up yet.", ar: "الامتحان ده لسة متظبطش ومتحطلوش أسئلة." },
  confirmEarlySubmit: { 
    en: "You've answered {ans} out of {total} questions. Are you sure you want to submit early?", 
    ar: "إنت جاوبت {ans} من أصل {total} سؤال. متأكد إنك عاوز تسلم وتخلص كده؟" 
  },
  submitError: { en: "Failed to submit exam. Please try again.", ar: "حصلت مشكلة وإنت بتسلم، حاول تاني." },
  optTrue: { en: "True", ar: "صح" },
  optFalse: { en: "False", ar: "غلط" },

  // Result Client
  congrats: { en: "Congratulations!", ar: "ألف مبروك يا وحش!" },
  keepPracticing: { en: "Keep Practicing!", ar: "معلش، شد حيلك المرة الجاية!" },
  completedExam: { en: "You have completed the exam.", ar: "عاش، إنت خلصت الامتحان." },
  correct: { en: "Correct", ar: "صح" },
  wrong: { en: "Wrong", ar: "غلط" },
  takeAnother: { en: "Take Another Exam", ar: "امتحن واحد تاني" },
  reviewAnswers: { en: "Review Correct Answers", ar: "راجع إجاباتك الصح" },
  hideAnswers: { en: "Hide Answers", ar: "خبي الإجابات" },
  examReview: { en: "Exam Review", ar: "مراجعة الامتحان" },
  explanation: { en: "Explanation", ar: "السبب (عشان إيه؟)" },
  leaderboardTitle: { en: "Leaderboard", ar: "لوحة الأوائل" },
  anonymous: { en: "Anonymous", ar: "مجهول" },
  you: { en: "(You)", ar: "(إنت)" },

  // Admin Login
  adminAccess: { en: "Admin Access", ar: "دخول الأدمن" },
  enterSecureCreds: { en: "Enter your secure credentials", ar: "اكتب الباص بتاعك يا ريس عشان تخش" },
  passwordPlaceholder: { en: "Enter Password...", ar: "اكتب الباسوورد..." },
  loginDashboard: { en: "Login to Dashboard", ar: "خش على لوحة التحكم" },
  loading: { en: "Loading...", ar: "بيحمل..." },
  invalidPassword: { en: "Invalid password, try again!", ar: "الباسوورد غلط يا وحش، جرب تاني!" },

  // Admin Dashboard
  adminDashboard: { en: "Admin Dashboard", ar: "لوحة تحكم الأدمن" },
  logout: { en: "Logout", ar: "اخرج" },
  examsManager: { en: "Exams Manager", ar: "مدير الامتحانات" },
  manageExamsDesc: { en: "Create, edit, and manage all your assessments.", ar: "ضيف وظبط كل امتحاناتك من هنا يا هندسة." },
  searchExams: { en: "Search exams...", ar: "دور على امتحان..." },
  newExam: { en: "New Exam", ar: "امتحان جديد" },
  createNewExam: { en: "Create New Exam", ar: "اعمل امتحان جديد" },
  examTitleLabel: { en: "Exam Title", ar: "اسم الامتحان" },
  examTitlePlaceholder: { en: "e.g. Midterm Pharmacology", ar: "مثلاً: ميدتيرم فارماكولوجي" },
  subjectLabel: { en: "Subject / Category", ar: "المادة" },
  subjectPlaceholder: { en: "e.g. Pharmaceutics", ar: "مثلاً: صيدلانيات" },
  createBtn: { en: "Create", ar: "ضيف الامتحان" },
  cancelBtn: { en: "Cancel", ar: "إلغاء" },
  manageBtn: { en: "Manage", ar: "ظبطه" },
  noExamsFoundAdmin: { en: "No exams found", ar: "مفيش امتحانات خالص" },
  createToGetStarted: { en: "Create a new exam to get started.", ar: "اعمل امتحان جديد عشان تبدأ." },
  confirmDeleteExam: { en: "Are you sure you want to delete this exam and all its questions?", ar: "متأكد إنك عاوز تمسح الامتحان ده وكل أسئلته؟" },
  usersTabAdmin: { en: "Registered Users", ar: "الطلاب المسجلين" },
  examsTabAdmin: { en: "Exams", ar: "الامتحانات" },
  noUsersFound: { en: "No users registered yet.", ar: "مفيش طلاب سجلت لسة." },
  joinedAt: { en: "Joined At", ar: "تاريخ التسجيل" },

  // Admin Exam Manager
  backToDashboard: { en: "Back to Dashboard", ar: "ارجع للوحة التحكم" },
  manageQuestionsDesc: { en: "Manage questions for this exam", ar: "ظبط أسئلة الامتحان ده براحتك" },
  questionsTab: { en: "Questions", ar: "الأسئلة" },
  resultsTab: { en: "Results", ar: "النتائج" },
  addManually: { en: "Add Manually", ar: "ضيف سؤال بإيدك" },
  smartImport: { en: "Smart Import", ar: "الإضافة الذكية" },
  smartParserTitle: { en: "Smart Parser Import", ar: "الساحر بتاع الأسئلة" },
  smartParserDesc: { en: "Paste your questions and answers directly.", ar: "الزق أسئلتك وإجاباتك هنا وهتتظبط لوحدها." },
  formatExample: { en: "Format Example:", ar: "مثال للصيغة:" },
  pasteHere: { en: "Paste your questions here...", ar: "الزق كل أسئلتك هنا..." },
  extractQuestions: { en: "Extract Questions", ar: "اسحب الأسئلة وحطها" },
  processing: { en: "Processing...", ar: "بيظبط الدنيا..." },
  addNewQuestion: { en: "Add New Question", ar: "ضيف سؤال جديد" },
  editQuestion: { en: "Edit Question", ar: "عدل السؤال" },
  multipleChoice: { en: "Multiple Choice", ar: "اختيارات" },
  tfChoice: { en: "True / False", ar: "صح وغلط" },
  questionText: { en: "Question Text", ar: "السؤال نفسه" },
  choiceA: { en: "Choice A", ar: "الاختيار أ" },
  choiceB: { en: "Choice B", ar: "الاختيار ب" },
  choiceC: { en: "Choice C", ar: "الاختيار ج" },
  choiceD: { en: "Choice D", ar: "الاختيار د" },
  tfAutoNote: { en: "Choices will be automatically set to True and False.", ar: "الاختيارات هتتحط لوحدها صح وغلط." },
  correctAnswerLabel: { en: "Correct Answer", ar: "الإجابة الصح إيه؟" },
  explanationLabel: { en: "Explanation (Optional)", ar: "السبب (عشان إيه؟) - اختياري" },
  explanationPlaceholder: { en: "Why is this answer correct? Will be shown after the exam.", ar: "ليه الإجابة دي صح؟ الطالب هيشوفها بعد الامتحان." },
  saveQuestion: { en: "Save Question", ar: "احفظ السؤال" },
  updateQuestion: { en: "Update Question", ar: "حدث السؤال" },
  noQuestionsYet: { en: "No questions yet", ar: "مفيش أسئلة لسة" },
  addQuestionsDesc: { en: "Add questions manually or use Smart Import to add them instantly.", ar: "ضيف أسئلة بإيدك أو استخدم الإضافة الذكية عشان تنجز." },
  confirmDeleteQ: { en: "Delete this question?", ar: "متأكد إنك عاوز تمسح السؤال ده؟" },

  // Admin Results Tab
  studentResultsForExam: { en: "Student Results for Exam", ar: "نتائج الطلاب في الامتحان" },
  noOneTookExam: { en: "No one has taken this exam yet.", ar: "محدش امتحن الامتحان ده لسة." },
  nameHeader: { en: "Name", ar: "الاسم" },
  scoreHeader: { en: "Score", ar: "الدرجة" },
  percentageHeader: { en: "Percentage", ar: "النسبة" },
  dateHeader: { en: "Date", ar: "التاريخ" },
  loadingData: { en: "Loading data...", ar: "بيحمل البيانات..." },
  examNotFound: { en: "Exam not found", ar: "الامتحان ده مش موجود يسطا" },
};

export function getT(lang: Language = "ar") {
  return (key: keyof typeof dict, params?: Record<string, string | number>): string => {
    let text: string = dict[key]?.[lang] || (key as string);
    if (params) {
      Object.keys(params).forEach(p => {
        text = text.replace(`{${p}}`, String(params[p]));
      });
    }
    return text;
  };
}
