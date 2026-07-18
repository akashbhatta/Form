/*
  ============================================================
  MENTAL HEALTH LITERACY SCALE (MHLS) — QUESTION BANK
  Source: "Mental Health Literacy among Secondary School Teachers of
  Dhulikhel Municipality" tool (Aakriti Bhatta, KU School of Medical
  Sciences).
  ============================================================
  Items 1–15 use a 4-point scale (either Likely/Unlikely or
  Helpful/Unhelpful wording, as printed in the source tool).
  Items 16–35 use a 5-point scale (Agreement or Willingness wording).

  Scoring note: values are stored exactly as selected (1 = leftmost
  option ... up to 4 or 5 = rightmost option). The source tool does not
  specify reverse-scoring for any item, so no reverse-coding is applied
  here — if your analysis plan calls for reverse-scoring specific
  stigma items (e.g. 20–28), do that during data analysis, not at the
  point of collection.
  ============================================================
*/

const SCALE_LIKELY = [
  { value: 1, label: "Very unlikely" },
  { value: 2, label: "Unlikely" },
  { value: 3, label: "Likely" },
  { value: 4, label: "Very Likely" }
];

const SCALE_HELPFUL = [
  { value: 1, label: "Very unhelpful" },
  { value: 2, label: "Unhelpful" },
  { value: 3, label: "Helpful" },
  { value: 4, label: "Very helpful" }
];

const SCALE_AGREE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neither agree nor disagree" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" }
];

const SCALE_WILLING = [
  { value: 1, label: "Definitely Unwilling" },
  { value: 2, label: "Probably unwilling" },
  { value: 3, label: "Neither unwilling nor willing" },
  { value: 4, label: "Probably willing" },
  { value: 5, label: "Definitely willing" }
];

const MHLS_QUESTIONS = [
  // ---- Recognition of disorders (1–10): Very unlikely → Very Likely ----
  { id: "mhls_q1", scale: SCALE_LIKELY, text:
    "If someone became extremely nervous or anxious in one or more situations with other people (e.g., a party) or performance situations (e.g., presenting at a meeting) in which they were afraid of being evaluated by others and that they would act in a way that was humiliating or feel embarrassed, then to what extent do you think it is likely they have Social Phobia?" },

  { id: "mhls_q2", scale: SCALE_LIKELY, text:
    "If someone experienced excessive worry about a number of events or activities where this level of concern was not warranted, had difficulty controlling this worry and had physical symptoms such as having tense muscles and feeling fatigued, then to what extent do you think it is likely they have Generalised Anxiety Disorder?" },

  { id: "mhls_q3", scale: SCALE_LIKELY, text:
    "If someone experienced a low mood for two or more weeks, had a loss of pleasure or interest in their normal activities and experienced changes in their appetite and sleep, then to what extent do you think it is likely they have Major Depressive Disorder?" },

  { id: "mhls_q4", scale: SCALE_LIKELY, text:
    "To what extent do you think it is likely that Personality Disorders are a category of mental illness?" },

  { id: "mhls_q5", scale: SCALE_LIKELY, text:
    "To what extent do you think it is likely that Persistent Depressive Disorder (Dysthymia) is a disorder?" },

  { id: "mhls_q6", scale: SCALE_LIKELY, text:
    "To what extent do you think it is likely that the diagnosis of Agoraphobia includes anxiety about situations where escape may be difficult or embarrassing?" },

  { id: "mhls_q7", scale: SCALE_LIKELY, text:
    "To what extent do you think it is likely that the diagnosis of Bipolar Disorder includes experiencing periods of elevated (i.e., high) and periods of depressed (i.e., low) mood?" },

  { id: "mhls_q8", scale: SCALE_LIKELY, text:
    "To what extent do you think it is likely that the diagnosis of Substance Abuse Disorder can include physical and psychological tolerance of the drug (i.e., require more of the drug to get the same effect)?" },

  { id: "mhls_q9", scale: SCALE_LIKELY, text:
    "To what extent do you think it is likely that in general in Nepal, women are MORE likely to experience a mental illness of any kind compared to men?" },

  { id: "mhls_q10", scale: SCALE_LIKELY, text:
    "To what extent do you think it is likely that in general, in Nepal, men are MORE likely to experience an anxiety disorder compared to women?" },

  // ---- Helpfulness / knowledge of interventions (11–15) ----
  { id: "mhls_q11", scale: SCALE_HELPFUL, text:
    "To what extent do you think it would be helpful for someone to improve their quality of sleep if they were having difficulties managing their emotions (e.g., becoming very anxious or depressed)?" },

  { id: "mhls_q12", scale: SCALE_HELPFUL, text:
    "To what extent do you think it would be helpful for someone to avoid all activities or situations that made them feel anxious if they were having difficulties managing their emotions?" },

  { id: "mhls_q13", scale: SCALE_LIKELY, text:
    "To what extent do you think it is likely that Cognitive Behaviour Therapy (CBT) is a therapy based on challenging negative thoughts and increasing helpful behaviours?" },

  { id: "mhls_q14", scale: SCALE_LIKELY, text:
    "Mental health professionals are bound by confidentiality; however there are certain conditions under which this does not apply. To what extent do you think it is likely that the following is a condition that would allow a mental health professional to break confidentiality: If you are at immediate risk of harm to yourself or others?" },

  { id: "mhls_q15", scale: SCALE_LIKELY, text:
    "Mental health professionals are bound by confidentiality; however there are certain conditions under which this does not apply. To what extent do you think it is likely that the following is a condition that would allow a mental health professional to break confidentiality: If your problem is not life-threatening and they want to assist others to better support you?" },

  // ---- Knowledge of where/how to seek information (16–19): Agreement scale ----
  { id: "mhls_q16", scale: SCALE_AGREE, text:
    "I am confident that I know where to seek information about mental illness." },

  { id: "mhls_q17", scale: SCALE_AGREE, text:
    "I am confident using the computer or telephone to seek information about mental illness." },

  { id: "mhls_q18", scale: SCALE_AGREE, text:
    "I am confident attending face to face appointments to seek information about mental illness." },

  { id: "mhls_q19", scale: SCALE_AGREE, text:
    "I am confident I have access to resources (e.g., internet, friends) that I can use to seek information about mental illness." },

  // ---- Stigmatising attitudes (20–28): Agreement scale ----
  { id: "mhls_q20", scale: SCALE_AGREE, text:
    "People with a mental illness could snap out of it if they wanted." },

  { id: "mhls_q21", scale: SCALE_AGREE, text:
    "A mental illness is a sign of personal weakness." },

  { id: "mhls_q22", scale: SCALE_AGREE, text:
    "A mental illness is not a real medical illness." },

  { id: "mhls_q23", scale: SCALE_AGREE, text:
    "People with a mental illness are dangerous." },

  { id: "mhls_q24", scale: SCALE_AGREE, text:
    "It is best to avoid people with a mental illness so that you don't develop this problem." },

  { id: "mhls_q25", scale: SCALE_AGREE, text:
    "If I had a mental illness I would not tell anyone." },

  { id: "mhls_q26", scale: SCALE_AGREE, text:
    "Seeing a mental health professional means you are not strong enough to manage your own difficulties." },

  { id: "mhls_q27", scale: SCALE_AGREE, text:
    "If I had a mental illness, I would not seek help from a mental health professional." },

  { id: "mhls_q28", scale: SCALE_AGREE, text:
    "I believe treatment for a mental illness, provided by a mental health professional, would not be effective." },

  // ---- Willingness / social distance (29–35): Willingness scale ----
  { id: "mhls_q29", scale: SCALE_WILLING, text:
    "How willing would you be to move next door to someone with a mental illness?" },

  { id: "mhls_q30", scale: SCALE_WILLING, text:
    "How willing would you be to spend an evening socialising with someone with a mental illness?" },

  { id: "mhls_q31", scale: SCALE_WILLING, text:
    "How willing would you be to make friends with someone with a mental illness?" },

  { id: "mhls_q32", scale: SCALE_WILLING, text:
    "How willing would you be to have someone with a mental illness start working closely with you on a job?" },

  { id: "mhls_q33", scale: SCALE_WILLING, text:
    "How willing would you be to have someone with a mental illness marry into your family?" },

  { id: "mhls_q34", scale: SCALE_WILLING, text:
    "How willing would you be to vote for a politician if you knew they had suffered a mental illness?" },

  { id: "mhls_q35", scale: SCALE_WILLING, text:
    "How willing would you be to employ someone if you knew they had a mental illness?" }
];
