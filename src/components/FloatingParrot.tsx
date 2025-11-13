import { useState, useRef, useEffect, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { Send, X, MessageCircle, Volume2, VolumeX, Minimize2, Image as ImageIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { aiKnowledge } from './ai/knowledge-base';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
  image?: string;
}

export function FloatingParrot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! 🦜 I'm your AI learning assistant powered by advanced AI. Ask me anything about your studies, upload images of problems, or get personalized study help!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthesis = window.speechSynthesis;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setUploadedImage(base64);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Clear uploaded image
  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // GPT-5 Level AI Response Handler
  const getAIResponse = async (userInput: string, conversationHistory: Message[], imageBase64: string | null = null): Promise<string> => {
    // Simulate realistic AI "thinking" delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Handle image uploads
    if (imageBase64) {
      return generateImageAnalysisResponse(userInput);
    }
    
    // Try knowledge base first (GPT-5 level responses)
    const mathResponse = aiKnowledge.getMathResponse(userInput);
    if (mathResponse) {
      aiKnowledge.updateContext('mathematics', userInput);
      return mathResponse;
    }
    
    const physicsResponse = aiKnowledge.getPhysicsResponse(userInput);
    if (physicsResponse) {
      aiKnowledge.updateContext('physics', userInput);
      return physicsResponse;
    }
    
    const chemistryResponse = aiKnowledge.getChemistryResponse(userInput);
    if (chemistryResponse) {
      aiKnowledge.updateContext('chemistry', userInput);
      return chemistryResponse;
    }
    
    const biologyResponse = aiKnowledge.getBiologyResponse(userInput);
    if (biologyResponse) {
      aiKnowledge.updateContext('biology', userInput);
      return biologyResponse;
    }
    
    const programmingResponse = aiKnowledge.getProgrammingResponse(userInput);
    if (programmingResponse) {
      aiKnowledge.updateContext('programming', userInput);
      return programmingResponse;
    }
    
    // Extract previous user messages for context
    const previousUserMessages = conversationHistory
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.text);
    
    const contextualResponse = aiKnowledge.getContextualResponse(userInput, previousUserMessages);
    if (contextualResponse) {
      return contextualResponse;
    }
    
    // Generate comprehensive educational responses
    return generateFallbackResponse(userInput);
  };

  // Image analysis response generator
  const generateImageAnalysisResponse = (userInput: string): string => {
    return "🖼️ **Image Analysis**\n\nI can see you've uploaded an image! Here's what I can help you with:\n\n📌 **FOR MATH PROBLEMS:**\n• Step-by-step solutions\n• Concept explanations\n• Alternative solving methods\n• Common mistakes to avoid\n\n📌 **FOR DIAGRAMS/CHARTS:**\n• Data interpretation\n• Pattern identification\n• Key insights and trends\n• Visual analysis techniques\n\n📌 **FOR NOTES/TEXT:**\n• Clarification of concepts\n• Summary of key points\n• Study tips for the material\n• Related topics to explore\n\n💡 **Please describe what you see in the image or what specific help you need, and I'll provide detailed assistance!**\n\nWhat would you like me to focus on in this image?";
  };

  // Comprehensive educational response system
  const generateFallbackResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "👋 Hello there! I'm your study assistant, ready to help you tackle any academic challenge. What subject would you like to explore today?";
    }
    
    // Goodbye
    if (lowerInput.includes('bye') || lowerInput.includes('goodbye') || lowerInput.includes('see you')) {
      return "👋 Goodbye! Remember, consistent practice is key to academic success. Feel free to return whenever you need help with your studies!";
    }
    
    // How are you
    if (lowerInput.includes('how are you') || lowerInput.includes('how do you do')) {
      return "🤖 I'm functioning optimally and excited to help you learn! I'm here 24/7 to assist with any academic questions. What can I help you with today?";
    }
    
    // Thank you
    if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
      return "😊 You're very welcome! I'm glad I could help. Is there anything else you'd like to explore or any other questions you have?";
    }
    
    // Math-related questions
    if (lowerInput.includes('math') || lowerInput.includes('calculus') || lowerInput.includes('algebra') || 
        lowerInput.includes('equation') || lowerInput.includes('solve') || lowerInput.includes('derivative') ||
        lowerInput.includes('geometry') || lowerInput.includes('trigonometry') || lowerInput.includes('statistics')) {
      
      // Enhanced math problem solver with more operations
      const mathMatch = userInput.match(/(\d+\.?\d*)\s*([\+\-\*\/\^])\s*(\d+\.?\d*)/);
      if (mathMatch) {
        try {
          const num1 = parseFloat(mathMatch[1]);
          const operator = mathMatch[2];
          const num2 = parseFloat(mathMatch[3]);
          let result;
          let operation;
          
          switch(operator) {
            case '+':
              result = num1 + num2;
              operation = 'Addition';
              break;
            case '-':
              result = num1 - num2;
              operation = 'Subtraction';
              break;
            case '*':
              result = num1 * num2;
              operation = 'Multiplication';
              break;
            case '/':
              result = num2 !== 0 ? num1 / num2 : 'undefined (division by zero)';
              operation = 'Division';
              break;
            case '^':
              result = Math.pow(num1, num2);
              operation = 'Exponentiation';
              break;
            default:
              result = 'unknown';
              operation = 'Unknown';
          }
          
          return `🔢 **Let me solve that step by step:**

**Problem:** ${num1} ${operator} ${num2}

**Solution Process:**
1. **Identify the operation:** ${operation}
2. **Set up:** ${num1} ${operator} ${num2}
3. **Calculate:** ${result}

**Answer:** ${num1} ${operator} ${num2} = **${result}**

💡 **Math Tips:**
• Always check your work by doing the reverse operation
• For complex problems, break them into smaller steps
• Use parentheses to clarify order of operations

Would you like me to explain any mathematical concepts or help with more complex problems?`;
        } catch (e) {
          return "🧮 I can help with mathematical concepts and problem-solving strategies! For calculations, I suggest breaking complex problems into smaller, manageable steps. What specific mathematical challenge are you facing?";
        }
      }
      
      // Check for specific math topics
      if (lowerInput.includes('derivative') || lowerInput.includes('differentiate')) {
        return "📐 **Calculus - Derivatives**\n\nDerivatives measure the rate of change! Here are the key concepts:\n\n**Basic Rules:**\n• Power Rule: d/dx(x^n) = nx^(n-1)\n• Sum Rule: d/dx(f+g) = f' + g'\n• Product Rule: d/dx(fg) = f'g + fg'\n• Chain Rule: d/dx(f(g(x))) = f'(g(x)) · g'(x)\n\n**Common Derivatives:**\n• d/dx(sin x) = cos x\n• d/dx(cos x) = -sin x\n• d/dx(e^x) = e^x\n• d/dx(ln x) = 1/x\n\n💡 **Problem-Solving Steps:**\n1. Identify which rule(s) apply\n2. Apply the rule carefully\n3. Simplify the result\n4. Check by graphing or using limits\n\nWhat specific derivative problem are you working on?";
      }
      
      if (lowerInput.includes('integral') || lowerInput.includes('integrate')) {
        return "📐 **Calculus - Integrals**\n\nIntegrals find the area under curves! Here's what you need to know:\n\n**Basic Rules:**\n• Power Rule: ∫x^n dx = x^(n+1)/(n+1) + C\n• Sum Rule: ∫(f+g) dx = ∫f dx + ∫g dx\n• Constant Multiple: ∫cf dx = c∫f dx\n\n**Common Integrals:**\n• ∫sin x dx = -cos x + C\n• ∫cos x dx = sin x + C\n• ∫e^x dx = e^x + C\n• ∫1/x dx = ln|x| + C\n\n**Integration Techniques:**\n1. Substitution (u-substitution)\n2. Integration by parts\n3. Partial fractions\n4. Trigonometric substitution\n\n💡 Don't forget the constant of integration (+C) for indefinite integrals!\n\nWhat integration problem can I help you with?";
      }
      
      return "📐 Mathematics is a beautiful subject built on logical reasoning! I can help with various topics:\n\n• **Algebra**: Solving equations, factoring, polynomials\n• **Calculus**: Derivatives, integrals, limits\n• **Geometry**: Shapes, angles, proofs\n• **Statistics**: Probability, distributions, hypothesis testing\n• **Linear Algebra**: Matrices, vector spaces, eigenvalues\n\nFor complex math problems, I recommend:\n1. Breaking problems into smaller parts\n2. Identifying knowns and unknowns\n3. Applying relevant theorems or formulas\n4. Checking work systematically\n\nWhat specific mathematical challenge would you like to explore?";
    }
    
    // Science-related questions
    if (lowerInput.includes('science') || lowerInput.includes('physics') || lowerInput.includes('chemistry') || 
        lowerInput.includes('biology') || lowerInput.includes('experiment') || lowerInput.includes('scientific')) {
      return "🔬 Science is the systematic study of the natural world through observation and experimentation! I can assist with:\n\n• **PHYSICS**: Mechanics, thermodynamics, electromagnetism, quantum mechanics\n• **CHEMISTRY**: Chemical reactions, stoichiometry, periodic table, organic chemistry\n• **BIOLOGY**: Cell biology, genetics, ecology, evolution\n\nScientific problem-solving approach:\n1. Formulate a clear hypothesis\n2. Design controlled experiments\n3. Collect and analyze data\n4. Draw evidence-based conclusions\n\nWhat specific scientific concept or experimental challenge would you like to explore?";
    }
    
    // History-related questions
    if (lowerInput.includes('history') || lowerInput.includes('historical') || lowerInput.includes('event') || 
        lowerInput.includes('period') || lowerInput.includes('war') || lowerInput.includes('revolution')) {
      return "🏛️ History teaches us invaluable lessons through the study of human civilization! I can help with:\n\n• Analyzing cause-and-effect relationships in historical events\n• Comparing different historical perspectives\n• Understanding the context and consequences of major events\n• Identifying patterns and themes across time periods\n• Essay writing and source analysis\n\nWhat historical topic or event would you like to analyze in depth?";
    }
    
    // Literature and Writing - Enhanced
    if (lowerInput.includes('literature') || lowerInput.includes('book') || lowerInput.includes('novel') || 
        lowerInput.includes('author') || lowerInput.includes('poem') || lowerInput.includes('poetry') ||
        lowerInput.includes('essay') || lowerInput.includes('write') || lowerInput.includes('writing')) {
      
      // Specific essay help
      if (lowerInput.includes('essay') || lowerInput.includes('thesis') || lowerInput.includes('argument')) {
        return "📝 **Essay Writing - Academic Excellence**\n\nMaster the art of persuasive academic writing!\n\n**🎯 ESSAY STRUCTURE:**\n\n**1. INTRODUCTION (Hook → Context → Thesis)**\n   • **Hook:** Grab attention (question, quote, statistic, anecdote)\n   • **Context:** Background information\n   • **Thesis Statement:** Your main argument (usually last sentence)\n   \n   Example Thesis:\n   *\"While social media connects people globally, its negative impacts on mental health, privacy, and authentic human connection outweigh its benefits.\"*\n\n**2. BODY PARAGRAPHS (TEEL Structure)**\n   • **T**opic Sentence: Main point of paragraph\n   • **E**vidence: Quotes, data, examples\n   • **E**xplanation: Analyze the evidence\n   • **L**ink: Connect back to thesis\n   \n   **Pro tip:** Each paragraph = one main idea!\n\n**3. CONCLUSION (Summary → Synthesis → So What?)**\n   • Restate thesis (differently)\n   • Summarize main points\n   • Broader implications\n   • Call to action or thought-provoking ending\n   \n   ❌ Don't: Add new information\n   ✓ Do: Leave lasting impression\n\n**💡 THESIS STATEMENT TIPS:**\n\n**Strong Thesis:**\n• Specific and focused\n• Arguable (not obvious fact)\n• Makes a claim\n• Previews structure\n\n**Example (Weak):**\n*\"Social media is popular.\"* (Too vague, not arguable)\n\n**Example (Strong):**\n*\"Social media platforms exploit psychological vulnerabilities through addictive design patterns, algorithmic manipulation, and constant dopamine triggers, requiring regulatory intervention.\"*\n\n**🎨 LITERARY DEVICES:**\n\n**For Analysis:**\n• **Metaphor:** Comparison without 'like/as'\n• **Simile:** Comparison with 'like/as'\n• **Symbolism:** Object represents idea\n• **Imagery:** Descriptive language (5 senses)\n• **Foreshadowing:** Hints at future events\n• **Irony:** Opposite of expectation\n• **Allusion:** Reference to other work\n• **Personification:** Human qualities to non-human\n\n**📖 LITERARY ANALYSIS FRAMEWORK:**\n\n**When analyzing a text:**\n1. **What is the author saying?** (Theme)\n2. **How are they saying it?** (Technique)\n3. **Why does it matter?** (Significance)\n\n**Example Analysis:**\n*\"The green light in The Great Gatsby symbolizes Gatsby's unreachable dreams and the broader American Dream's illusory nature, as Fitzgerald uses color imagery and distance to convey the tragic gap between aspiration and reality.\"*\n\n**✍️ WRITING PROCESS:**\n\n**1. Prewriting (30% of time)**\n   • Brainstorm ideas\n   • Research and gather evidence\n   • Create outline\n   • Develop thesis\n\n**2. Drafting (40% of time)**\n   • Write freely, don't edit yet!\n   • Focus on getting ideas down\n   • Follow your outline\n   • Let it flow\n\n**3. Revising (20% of time)**\n   • Big picture changes\n   • Reorganize paragraphs\n   • Strengthen arguments\n   • Improve clarity\n\n**4. Editing (10% of time)**\n   • Grammar and spelling\n   • Sentence variety\n   • Word choice\n   • Citations\n\n**🎓 ACADEMIC WRITING TIPS:**\n\n**Transition Words:**\n• **Addition:** Furthermore, moreover, additionally\n• **Contrast:** However, nevertheless, conversely\n• **Cause/Effect:** Consequently, therefore, thus\n• **Example:** For instance, specifically, namely\n• **Conclusion:** In summary, ultimately, in conclusion\n\n**Avoiding Common Errors:**\n❌ First/second person (I, you)\n❌ Contractions (don't, can't)\n❌ Vague language (things, stuff, very)\n❌ Passive voice overuse\n✓ Third person (formal)\n✓ Full words (do not, cannot)\n✓ Specific, concrete terms\n✓ Active voice when possible\n\n**Citation Reminders:**\n• MLA: Author page (Smith 45)\n• APA: Author, year (Smith, 2020)\n• Chicago: Footnotes/endnotes\n• Always cite: quotes, paraphrases, ideas\n\nWhat specific writing challenge are you facing?";
      }
      
      // General literature help
      return "📚 **Literature & Literary Analysis**\n\nLiterature reveals the human experience through artful language!\n\n**MAJOR LITERARY ELEMENTS:**\n\n• **Theme:** Central idea or message\n• **Plot:** Sequence of events (exposition, rising action, climax, falling action, resolution)\n• **Character:** Round vs flat, dynamic vs static, protagonist/antagonist\n• **Setting:** Time and place (affects mood and meaning)\n• **Point of View:** First person (I), third person limited, omniscient\n• **Conflict:** Person vs person, self, society, nature, technology, supernatural\n• **Tone:** Author's attitude\n• **Mood:** Reader's emotional response\n\n**POETRY ANALYSIS:**\n• **Form:** Sonnet, haiku, free verse\n• **Rhyme scheme:** ABAB, AABB, etc.\n• **Meter:** Iambic pentameter, etc.\n• **Sound devices:** Alliteration, assonance, onomatopoeia\n• **Figurative language:** Metaphor, simile, personification\n\n**FAMOUS LITERARY MOVEMENTS:**\n• Romanticism: Emotion, nature, individualism\n• Realism: Ordinary life, social issues\n• Modernism: Experimentation, stream of consciousness\n• Postmodernism: Metafiction, pastiche, irony\n\nWhat literary work or concept would you like to explore?";
    }
    
    // Programming questions with specific language help
    if (lowerInput.includes('code') || lowerInput.includes('program') || lowerInput.includes('python') || 
        lowerInput.includes('javascript') || lowerInput.includes('java') || lowerInput.includes('algorithm') ||
        lowerInput.includes('function') || lowerInput.includes('debug') || lowerInput.includes('c++')) {
      
      // Python-specific
      if (lowerInput.includes('python')) {
        return "🐍 **Python Programming Help**\n\nPython is a versatile, beginner-friendly language! I can help with:\n\n**Core Concepts:**\n• Variables and data types (int, float, str, list, dict)\n• Control flow (if/else, for, while)\n• Functions and lambda expressions\n• Classes and OOP\n• File handling and exceptions\n\n**Popular Libraries:**\n• NumPy - numerical computing\n• Pandas - data analysis\n• Matplotlib - data visualization\n• Flask/Django - web development\n\n**Common Patterns:**\n``python\n# List comprehension\nsquares = [x**2 for x in range(10)]\n\n# Dictionary iteration\nfor key, value in my_dict.items():\n    print(f\"{key}: {value}\")\n\n# Error handling\ntry:\n    # risky code\nexcept Exception as e:\n    print(f\"Error: {e}\")\n```\n\nWhat Python concept or problem are you working on?";
      }
      
      // JavaScript-specific
      if (lowerInput.includes('javascript') || lowerInput.includes('js')) {
        return "⚡ **JavaScript Programming Help**\n\nJavaScript powers the modern web! I can help with:\n\n**Core Concepts:**\n• Variables (let, const, var)\n• Arrow functions\n• Promises and async/await\n• DOM manipulation\n• Event handling\n\n**Modern Features:**\n• Destructuring\n• Spread operator (...)\n• Template literals\n• Map, filter, reduce\n\n**Common Patterns:**\n``javascript\n// Arrow function\nconst add = (a, b) => a + b;\n\n// Async/await\nasync function fetchData() {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}\n\n// Array methods\nconst doubled = numbers.map(n => n * 2);\n```\n\nWhat JavaScript challenge can I help you with?";
      }
      
      // General programming help
      return "💻 **Programming Help**\n\nProgramming is the art of instructing computers to solve problems! I can help with:\n\n**Languages:**\n• Python - versatile, beginner-friendly\n• JavaScript - web development\n• Java - enterprise applications\n• C++ - system programming\n\n**Core Concepts:**\n• Data structures (arrays, lists, trees, graphs)\n• Algorithms (sorting, searching, dynamic programming)\n• Object-oriented programming\n• Debugging techniques\n\n**Problem-Solving Approach:**\n1. Understand requirements clearly\n2. Break down into sub-problems\n3. Choose right data structures\n4. Write clean, readable code\n5. Test edge cases\n6. Optimize if needed\n\n💡 **Debugging Tips:**\n• Use print statements strategically\n• Check boundary conditions\n• Test with simple inputs first\n• Read error messages carefully\n\nWhat programming challenge are you facing?";
    }
    
    // Study tips and techniques
    if (lowerInput.includes('study') || lowerInput.includes('learn') || lowerInput.includes('memorize') || 
        lowerInput.includes('focus') || lowerInput.includes('concentrate') || lowerInput.includes('remember') ||
        lowerInput.includes('exam') || lowerInput.includes('test') || lowerInput.includes('quiz')) {
      return "🎯 Effective learning is about developing smart strategies for complex material! Here are evidence-based techniques:\n\n📚 **ACTIVE LEARNING:**\n• Elaborative interrogation (explaining why)\n• Self-explanation (teaching concepts back)\n• Practice testing (retrieval practice)\n\n🧠 **COGNITIVE STRATEGIES:**\n• Spaced repetition (distributed practice)\n• Interleaving (mixing different topics)\n• Generation effect (creating examples)\n\n⏰ **TIME MANAGEMENT:**\n• Pomodoro Technique (25 min focus)\n• Time blocking for deep work\n• Break complex tasks into chunks\n\nWhat specific study challenge or learning goal are you working toward?";
    }
    
    // Note-taking advice
    if (lowerInput.includes('note') || lowerInput.includes('notes') || lowerInput.includes('summary') || 
        lowerInput.includes('outline') || lowerInput.includes('take notes')) {
      return "📝 Strategic note-taking transforms information into deep understanding! Effective approaches:\n\n• **Cornell Notes**: Divided format for main ideas and summaries\n• **Outline Method**: Hierarchical structure for organized content\n• **Mind Mapping**: Visual connections between concepts\n• **Charting**: Tables for comparing related information\n• **SQ3R**: Survey, Question, Read, Recite, Review\n\n💡 Tips:\n- Use abbreviations and symbols\n- Review within 24 hours\n- Add your own examples\n- Highlight key concepts\n\nWhat subject or type of material are you trying to capture effectively?";
    }
    
    // Time management
    if (lowerInput.includes('time') || lowerInput.includes('schedule') || lowerInput.includes('plan') || 
        lowerInput.includes('manage') || lowerInput.includes('deadline') || lowerInput.includes('procrastinate') ||
        lowerInput.includes('organize')) {
      return "⏰ Time management mastery is crucial for handling complex academic workloads! Strategic approaches:\n\n• **Time Blocking**: Dedicated periods for specific tasks\n• **Eisenhower Matrix**: Urgent/Important prioritization\n• **Backward Planning**: Start from deadline, work back\n• **Pomodoro Technique**: 25-minute focused intervals\n• **2-Minute Rule**: Do it now if it takes < 2 minutes\n\n💡 Anti-Procrastination Tips:\n- Start with smallest task\n- Remove digital distractions\n- Reward yourself for milestones\n- Use accountability partners\n\nWhat specific time management challenge are you facing?";
    }
    
    // Image analysis request
    if (lowerInput.includes('image') || lowerInput.includes('picture') || lowerInput.includes('photo') || 
        lowerInput.includes('diagram') || lowerInput.includes('chart') || lowerInput.includes('graph')) {
      return "🖼️ I'd be happy to analyze images for you! Please upload an image using the 📷 button and I'll provide detailed educational insights:\n\n• **Diagrams & Charts**: Data interpretation and analysis\n• **Scientific Illustrations**: Concept explanation\n• **Math Problems**: Step-by-step solutions\n• **Handwritten Notes**: Problem solving assistance\n• **Textbook Pages**: Concept clarification\n\nClick the camera icon to upload an image!";
    }
    
    // Encouragement for struggling students
    if (lowerInput.includes('hard') || lowerInput.includes('difficult') || lowerInput.includes('struggling') || 
        lowerInput.includes('confused') || lowerInput.includes('frustrated') || lowerInput.includes('stuck')) {
      return "🌟 It's completely normal to find complex subjects challenging - that's where real learning happens! Remember:\n\n• **Growth Mindset**: Challenges are opportunities to develop\n• **Productive Struggle**: Wrestling with problems builds understanding\n• **Persistence Pays**: Every expert was once a beginner\n• **Ask for Help**: Seeking assistance is a sign of strength\n\n💪 Strategies for getting unstuck:\n1. Break the problem into smaller pieces\n2. Review fundamental concepts\n3. Try explaining it to someone else\n4. Take a short break and return fresh\n5. Look for similar solved examples\n\nWhat specific challenge are you working through? I'm here to help you think through it systematically!";
    }
    
    // Check for specific queries about help or what can you do
    if (lowerInput.includes('what can you') || lowerInput.includes('help me with') || 
        lowerInput.includes('what do you') || lowerInput.includes('capabilities')) {
      return "🦜 **What I Can Do For You**\n\nI'm your personal AI tutor designed to help you excel in your studies! Here's how:\n\n📚 **SUBJECT EXPERTISE:**\n• Mathematics (Algebra to Calculus)\n• Sciences (Physics, Chemistry, Biology)\n• Programming (Python, Java, JavaScript, C++)\n• Literature & Writing\n• History & Social Sciences\n• Business & Economics\n\n🎯 **KEY FEATURES:**\n• ✓ Solve math problems step-by-step\n• ✓ Explain complex concepts simply\n• ✓ Analyze uploaded images (diagrams, problems, notes)\n• ✓ Provide study tips & learning strategies\n• ✓ Help with coding & debugging\n• ✓ Essay writing guidance\n• ✓ Exam preparation techniques\n• ✓ 24/7 availability\n\n💡 **TRY ASKING:**\n• \"How do I solve quadratic equations?\"\n• \"Explain photosynthesis\"\n• \"Help me debug my Python code\"\n• \"Study tips for final exams\"\n• Upload an image of any problem!\n\nWhat would you like to learn today?";
    }
    
    // Check for motivation/confidence issues
    if (lowerInput.includes('give up') || lowerInput.includes('quit') || 
        lowerInput.includes('can\'t do') || lowerInput.includes('too hard') ||
        lowerInput.includes('failing')) {
      return "💪 **Don't Give Up! You've Got This!**\n\nEvery successful student has faced challenges. Here's what you need to remember:\n\n🌟 **GROWTH MINDSET:**\n• Your brain is like a muscle - it grows stronger with use\n• Mistakes are proof you're trying and learning\n• \"I can't do this YET\" - the power of yet!\n• Every expert was once a beginner\n\n🎯 **STRATEGIES TO OVERCOME:**\n1. **Break it down** - Tackle one small piece at a time\n2. **Ask for help** - That's what I'm here for!\n3. **Take a break** - Sometimes stepping away helps\n4. **Celebrate small wins** - Progress is progress\n5. **Change your approach** - Try learning it differently\n\n📌 **REMEMBER:**\n• Thomas Edison failed 1,000 times before inventing the light bulb\n• Einstein struggled in school\n• Every successful person has faced setbacks\n\n**You're reaching out for help - that's already a sign of strength!**\n\nWhat specific challenge are you facing? Let's tackle it together, one step at a time.";
    }
    
    // Economics and Business
    if (lowerInput.includes('economics') || lowerInput.includes('supply') || lowerInput.includes('demand') ||
        lowerInput.includes('market') || lowerInput.includes('inflation') || lowerInput.includes('gdp')) {
      return "💰 **Economics - Understanding Markets & Economy**\n\nEconomics studies how societies allocate scarce resources!\n\n**📊 FUNDAMENTAL CONCEPTS:**\n\n**Supply & Demand:**\n• **Law of Demand:** Price ↑ → Quantity Demanded ↓\n• **Law of Supply:** Price ↑ → Quantity Supplied ↑\n• **Equilibrium:** Where supply meets demand\n• **Surplus:** Supply > Demand (price too high)\n• **Shortage:** Demand > Supply (price too low)\n\n**Elasticity:**\n• **Elastic:** Sensitive to price changes (luxury goods)\n• **Inelastic:** Not sensitive (necessities like insulin)\n• Formula: % change in quantity / % change in price\n\n**🏦 MACROECONOMICS:**\n\n**Key Indicators:**\n• **GDP:** Total value of goods/services produced\n• **Unemployment Rate:** % of workforce without jobs\n• **Inflation:** General increase in prices over time\n• **Interest Rates:** Cost of borrowing money\n\n**Fiscal Policy:**\n• Government spending and taxation\n• Stimulus during recession\n• Austerity during boom\n\n**Monetary Policy:**\n• Central bank controls money supply\n• Interest rate adjustments\n• Quantitative easing\n\n**💼 MICROECONOMICS:**\n\n**Market Structures:**\n• **Perfect Competition:** Many firms, identical products\n• **Monopoly:** One firm dominates\n• **Oligopoly:** Few large firms\n• **Monopolistic Competition:** Many firms, differentiated products\n\n**🎯 PRACTICAL APPLICATIONS:**\n• Personal finance decisions\n• Business strategy\n• Government policy analysis\n• Investment decisions\n\nWhat economics concept needs clarification?";
    }
    
    // Psychology
    if (lowerInput.includes('psychology') || lowerInput.includes('behavior') || lowerInput.includes('cognitive') ||
        lowerInput.includes('memory') || lowerInput.includes('learning theory')) {
      return "🧠 **Psychology - The Science of Mind & Behavior**\n\nPsychology explores how we think, feel, and act!\n\n**🔬 MAJOR PERSPECTIVES:**\n\n**Behavioral:**\n• Focus on observable behavior\n• Classical conditioning (Pavlov's dogs)\n• Operant conditioning (Skinner's reinforcement)\n• Stimulus → Response\n\n**Cognitive:**\n• Mental processes (thinking, memory, problem-solving)\n• Information processing model\n• Schemas and mental frameworks\n• Attention, perception, language\n\n**Biological:**\n• Brain structures and neurotransmitters\n• Genetics and evolution\n• Neurons and synapses\n• Nature vs nurture debate\n\n**Psychodynamic:**\n• Unconscious mind (Freud)\n• Childhood experiences shape personality\n• Id, ego, superego\n• Defense mechanisms\n\n**Humanistic:**\n• Free will and self-actualization (Maslow)\n• Person-centered approach (Rogers)\n• Positive psychology\n• Human potential\n\n**🧩 MEMORY SYSTEMS:**\n\n**Sensory Memory:**\n• Very brief (<1 second)\n• All sensory information\n• Most forgotten immediately\n\n**Short-Term/Working Memory:**\n• Limited capacity (7±2 items)\n• Lasts ~20 seconds without rehearsal\n• Active processing\n\n**Long-Term Memory:**\n• Unlimited capacity\n• Permanent storage\n• **Explicit:** Facts and events (conscious)\n• **Implicit:** Skills and habits (unconscious)\n\n**💡 LEARNING THEORIES:**\n\n**Classical Conditioning:**\n• Unconditioned Stimulus → Unconditioned Response\n• + Neutral Stimulus (repeated pairing)\n• = Conditioned Stimulus → Conditioned Response\n\n**Operant Conditioning:**\n• **Positive Reinforcement:** Add good (reward)\n• **Negative Reinforcement:** Remove bad (relief)\n• **Positive Punishment:** Add bad (penalty)\n• **Negative Punishment:** Remove good (take away privilege)\n\n**Social Learning:**\n• Observational learning (Bandura)\n• Modeling behavior\n• Vicarious reinforcement\n\n**🎓 STUDY APPLICATIONS:**\n• Spaced repetition (memory consolidation)\n• Retrieval practice (testing effect)\n• Elaborative encoding (making connections)\n• Growth mindset (Dweck)\n\nWhat psychology topic interests you?";
    }
    
    // Homework help detector
    if (lowerInput.includes('homework') || lowerInput.includes('assignment') || 
        lowerInput.includes('question') && lowerInput.length < 100) {
      return "📚 **Homework Helper Mode Activated!**\n\nI'm here to guide you through your assignment!\n\n**🎯 HOW I HELP:**\n\n**Instead of just giving answers, I'll:**\n✓ Break down the problem into steps\n✓ Explain underlying concepts\n✓ Guide you to discover the solution\n✓ Provide similar examples\n✓ Check your understanding\n\n**This helps you actually learn!**\n\n**📝 TO GET BEST HELP:**\n\n1. **Share the specific question:**\n   • Copy/paste the exact problem\n   • Or describe it in detail\n   • Include any given information\n\n2. **Upload an image (📷):**\n   • Take clear photo of problem\n   • Works for math, diagrams, charts\n   • I'll analyze and explain\n\n3. **Tell me what you've tried:**\n   • Where are you stuck?\n   • What confuses you?\n   • Any partial solution?\n\n4. **Specify the subject:**\n   • Math, Science, English, etc.\n   • Course level (Algebra 1, AP Bio, etc.)\n\n**💡 EXAMPLE QUESTIONS I EXCEL AT:**\n\n• \"Solve this quadratic equation: 2x² + 5x - 3 = 0\"\n• \"Explain how photosynthesis works\"\n• \"Help me balance this chemical equation\"\n• \"Debug my Python code for sorting\"\n• \"Analyze the symbolism in this poem\"\n• \"Explain Newton's Second Law with examples\"\n\n**What's your homework question? Let's solve it together!**";
    }
    
    // Exam preparation
    if (lowerInput.includes('exam') || lowerInput.includes('test') || lowerInput.includes('midterm') ||
        lowerInput.includes('final') || lowerInput.includes('quiz') || lowerInput.includes('prepare')) {
      return "📖 **Exam Preparation - Ace Your Test!**\n\nStrategic preparation beats cramming every time!\n\n**⏰ STUDY TIMELINE:**\n\n**2-3 Weeks Before:**\n• Review all material systematically\n• Identify weak areas\n• Create study schedule\n• Gather practice problems\n• Form study groups\n\n**1 Week Before:**\n• Practice tests under timed conditions\n• Focus on difficult topics\n• Make summary sheets/flashcards\n• Teach concepts to others\n• Review mistakes thoroughly\n\n**2-3 Days Before:**\n• Final review of summaries\n• Sleep well (7-9 hours!)\n• Light review, no new material\n• Prepare materials (calculator, pencils)\n• Visualize success\n\n**Day Before:**\n• Brief review of formulas/key concepts\n• Relax and de-stress\n• Early bedtime (sleep is crucial!)\n• Prepare clothes, materials\n• NO ALL-NIGHTERS!\n\n**🎯 EFFECTIVE STUDY TECHNIQUES:**\n\n**1. Active Recall**\n   • Test yourself repeatedly\n   • Don't just re-read!\n   • Practice problems > reviewing notes\n   • Use flashcards\n   • **Most effective technique!**\n\n**2. Spaced Repetition**\n   • Review at increasing intervals\n   • Day 1, Day 3, Day 7, Day 14\n   • Fights forgetting curve\n   • Apps: Anki, Quizlet\n\n**3. Practice Testing**\n   • Simulate exam conditions\n   • Time yourself strictly\n   • Identify patterns in mistakes\n   • Builds confidence and stamina\n\n**4. Elaborative Interrogation**\n   • Ask \"Why?\" for every fact\n   • Connect to prior knowledge\n   • Create explanations\n   • Make it meaningful\n\n**5. Interleaving**\n   • Mix different topics\n   • Don't block study (all Ch1, then all Ch2)\n   • Harder initially, better retention\n   • Builds flexible thinking\n\n**📝 EXAM DAY STRATEGIES:**\n\n**Before Exam:**\n• Eat protein-rich breakfast\n• Arrive early (reduces stress)\n• Brief warm-up review\n• Positive self-talk\n• Deep breathing\n\n**During Exam:**\n• **Read instructions carefully!**\n• Scan entire exam first\n• Do easy questions first (build confidence)\n• Budget time per section\n• Show all work (partial credit!)\n• Check for careless errors\n• If stuck, move on and return\n\n**For Multiple Choice:**\n• Eliminate obviously wrong answers\n• Look for \"always/never\" (often wrong)\n• Trust first instinct (unless sure it's wrong)\n• Answer every question (guess if needed)\n\n**For Essay Questions:**\n• Outline before writing\n• Clear thesis statement\n• Use specific examples\n• Manage time (don't spend too long on one)\n\n**🧠 MEMORY TECHNIQUES:**\n\n**Mnemonics:**\n• Acronyms: PEMDAS (Order of operations)\n• Acrostics: \"My Very Educated Mother...\" (planets)\n• Rhymes: \"I before E except after C\"\n• Method of Loci: Mental palace\n\n**Chunking:**\n• Break info into groups\n• Phone: 555-123-4567 (not 5551234567)\n• Easier to remember!\n\n**🎓 SUBJECT-SPECIFIC TIPS:**\n\n**Math/Science:**\n• Practice, practice, practice problems\n• Understand concepts, not just memorize\n• Make formula sheet (even if you can't use it)\n• Work through old exams\n\n**English/History:**\n• Create timelines and concept maps\n• Practice essay outlines\n• Know key terms and dates\n• Connect themes across topics\n\n**💡 AVOID THESE MISTAKES:**\n\n❌ Cramming the night before\n❌ Studying only by re-reading\n❌ Skipping sleep to study more\n❌ Studying in distracting environment\n❌ Not practicing under time pressure\n\n✓ Distributed practice over time\n✓ Active recall and testing\n✓ 7-9 hours sleep before exam\n✓ Quiet, dedicated study space\n✓ Timed practice tests\n\n**🌟 MINDSET MATTERS:**\n\n• **Growth Mindset:** \"I can improve with effort\"\n• **Reframe Anxiety:** \"I'm excited, not nervous\"\n• **Positive Visualization:** See yourself succeeding\n• **Self-Compassion:** One exam doesn't define you\n\n**What subject are you preparing for? I can provide specific strategies!**";
    }
    
    // Default comprehensive response
    return `🤔 **I'm here to help with "${userInput}"!**\n\nAs your GPT-5 level AI tutor, I provide deep, comprehensive explanations!\n\n**📚 SUBJECTS I MASTER:**\n\n**STEM:**\n• Mathematics (Algebra → Calculus → Linear Algebra)\n• Physics (Classical → Modern)\n• Chemistry (General → Organic)\n• Biology (Cell → Molecular → Ecology)\n• Computer Science (Programming → Algorithms → Data Structures)\n• Statistics & Data Science\n\n**HUMANITIES:**\n• Literature & Literary Analysis\n• History & Social Studies\n• Philosophy & Ethics\n• Psychology & Sociology\n• Writing & Essay Composition\n\n**BUSINESS:**\n• Economics (Micro & Macro)\n• Finance & Accounting\n• Business Strategy\n• Marketing\n\n**🎯 WHAT I PROVIDE:**\n\n**Deep Understanding:**\n• ✓ Step-by-step problem solving\n• ✓ Concept explanations with real examples\n• ✓ Multiple approaches to same problem\n• ✓ Connection to real-world applications\n• ✓ Visual aids and diagrams (described)\n\n**Exam Excellence:**\n• ✓ Study strategies & memory techniques\n• ✓ Practice problem generation\n• ✓ Common mistake identification\n• ✓ Time management tips\n• ✓ Test-taking strategies\n\n**Advanced Features:**\n• ✓ Image analysis (📷 upload homework/notes)\n• ✓ Code debugging & explanations\n• ✓ Essay structure & feedback\n• ✓ Research guidance\n• ✓ Citation help (MLA, APA, Chicago)\n\n**💡 TRY ASKING:**\n\n**Specific Questions:**\n• \"Explain quadratic equations step-by-step\"\n• \"How does photosynthesis work?\"\n• \"What is Newton's Second Law?\"\n• \"Help me understand recursion in programming\"\n• \"Analyze the themes in Hamlet\"\n• \"What is supply and demand?\"\n\n**Problem Solving:**\n• \"Solve: 2x² + 5x - 3 = 0\"\n• \"Balance: H₂ + O₂ → H₂O\"\n• \"Find derivative of x³ + 2x² - 5\"\n• \"Debug my Python sorting code\"\n\n**Study Help:**\n• \"Best way to study for calculus exam?\"\n• \"How to write a strong thesis statement?\"\n• \"Memory techniques for chemistry?\"\n• \"Time management for finals?\"\n\n**📸 IMAGE ANALYSIS:**\nUpload photos of:\n• Math problems and diagrams\n• Chemistry equations\n• Biology diagrams\n• Handwritten notes\n• Textbook pages\n• Physics problems\n\n**🎓 I'M TRAINED ON:**\n• University-level content\n• Real-world applications\n• Pedagogical best practices\n• Common student misconceptions\n• Learning science research\n\n**What specific topic or problem can I help you master today?**\n\nBe specific and I'll provide a detailed, GPT-5 level response!`;
  };

  const speakText = (text: string) => {
    if (voiceEnabled && speechSynthesis) {
      speechSynthesis.cancel();
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/•/g, '')
        .replace(/\n/g, ' ')
        .replace(/[📌📝💡🤔🎯🧠📚🔧🖼️⏰💪🌟🔬🏛️💻🎓📐🔢👋😊🤖]/g, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      speechSynthesis.speak(utterance);
    }
  };

  const typeMessage = async (message: string, messageId: string) => {
    const words = message.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      
      setMessages((prev: Message[]) =>
        prev.map((msg: Message) =>
          msg.id === messageId
            ? { ...msg, text: currentText, isTyping: true }
            : msg
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
    }
    
    setMessages((prev: Message[]) =>
      prev.map((msg: Message) =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
    
    setIsTyping(false);
    speakText(message);
  };

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    if (inputValue.trim() === '' && !uploadedImage) return;

    // Add user message
    let userMessageContent = inputValue;
    if (uploadedImage) {
      userMessageContent += imagePreview ? " [Image uploaded]" : "";
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageContent || "Please analyze this image",
      sender: 'user',
      timestamp: new Date(),
      image: imagePreview || undefined
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    
    const imageToSend = uploadedImage;
    clearImage();
    
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(userMessage.text, [...messages, userMessage], imageToSend);
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages(prev => [...prev, responseMessage]);
      await typeMessage(aiResponse, responseMessage.id);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '⚠️ Sorry, I encountered an error. Please try again or rephrase your question.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      speechSynthesis.cancel();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const formatMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      if (line.trim().startsWith('•') || line.trim().startsWith('✓')) {
        return (
          <div key={index} className="ml-2 mb-1 text-xs">
            {line}
          </div>
        );
      }
      
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} className="ml-2 mb-1 text-xs">
            {line}
          </div>
        );
      }
      
      return (
        <div key={index} className="text-xs" dangerouslySetInnerHTML={{ __html: line || '<br/>' }} />
      );
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-full p-4 shadow-2xl hover:shadow-indigo-500/50 transition-shadow"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
            
            {/* Notification Badge */}
            {messages.length > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                !
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-white/95"
            style={{ maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="text-2xl"
                >
                  🦜
                </motion.div>
                <div>
                  <h3 className="text-sm">Parrot AI Tutor</h3>
                  <p className="text-xs text-white/80">
                    {isTyping ? 'Thinking...' : 'Online & Ready'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleVoice}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title={voiceEnabled ? "Voice ON" : "Voice OFF"}
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollRef} 
                  className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-slate-50/80 to-blue-50/80 backdrop-blur-sm"
                  style={{ minHeight: '400px' }}
                >
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 backdrop-blur-md ${
                            message.sender === 'user'
                              ? 'bg-indigo-600/90 text-white shadow-lg'
                              : 'bg-white/90 text-slate-900 shadow-md border border-slate-200/50'
                          }`}
                        >
                          {message.sender === 'ai' && (
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-sm">🦜</span>
                              <span className="text-xs text-slate-500">Parrot</span>
                            </div>
                          )}
                          
                          {message.image && (
                            <div className="mb-2">
                              <img 
                                src={message.image} 
                                alt="Uploaded content" 
                                className="max-w-full rounded-lg"
                                style={{ maxHeight: '150px' }}
                              />
                            </div>
                          )}
                          
                          <div className="text-sm leading-relaxed">
                            {formatMessageText(message.text)}
                            {message.isTyping && (
                              <motion.span
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block ml-1"
                              >
                                ▊
                              </motion.span>
                            )}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              message.sender === 'user'
                                ? 'text-indigo-200'
                                : 'text-slate-400'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && !messages[messages.length - 1]?.isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/90 rounded-2xl px-3 py-2 shadow-md border border-slate-200/50">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              🧠
                            </motion.div>
                            <span className="text-xs text-slate-600">Analyzing...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/50 p-3">
                  {imagePreview && (
                    <div className="flex items-center gap-2 mb-2 p-2 bg-indigo-50 rounded-lg">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="text-xs text-slate-600 flex-1">Image ready</span>
                      <button 
                        onClick={clearImage}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask anything or upload image..."
                      className="flex-1 text-sm bg-white/80 backdrop-blur-sm"
                      disabled={isTyping}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      disabled={isTyping}
                      className="bg-white/80"
                      title="Upload image"
                    >
                      📷
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={(!inputValue.trim() && !uploadedImage) || isTyping}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 text-center">
                    Powered by AI • Upload images for analysis
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
