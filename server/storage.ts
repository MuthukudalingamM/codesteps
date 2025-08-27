import { 
  type User, 
  type InsertUser,
  type Lesson,
  type InsertLesson,
  type Challenge,
  type InsertChallenge,
  type UserProgress,
  type InsertUserProgress,
  type CommunityPost,
  type InsertCommunityPost,
  type AiSession,
  type InsertAiSession
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Lesson methods
  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | undefined>;

  // Challenge methods
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  getChallengesByDifficulty(difficulty: string): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;

  // User Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Community methods
  getCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPost(id: string, updates: Partial<CommunityPost>): Promise<CommunityPost | undefined>;

  // AI Session methods
  getAiSession(id: string): Promise<AiSession | undefined>;
  getUserAiSessions(userId: string): Promise<AiSession[]>;
  createAiSession(session: InsertAiSession): Promise<AiSession>;
  updateAiSession(id: string, updates: Partial<AiSession>): Promise<AiSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private lessons: Map<string, Lesson>;
  private challenges: Map<string, Challenge>;
  private userProgress: Map<string, UserProgress>;
  private communityPosts: Map<string, CommunityPost>;
  private aiSessions: Map<string, AiSession>;

  constructor() {
    this.users = new Map();
    this.lessons = new Map();
    this.challenges = new Map();
    this.userProgress = new Map();
    this.communityPosts = new Map();
    this.aiSessions = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize comprehensive course - Scratch to Expert
    const defaultLessons: Lesson[] = [
      // BEGINNER LEVEL (1-15)
      {
        id: "1",
        title: "What is Programming?",
        description: "Introduction to programming concepts and JavaScript",
        content: "Programming is the process of creating instructions for computers to follow. JavaScript is a popular programming language that runs in web browsers and servers. It's used to create interactive websites, mobile apps, and server applications.\n\nKey concepts:\n• Algorithms - step-by-step instructions\n• Syntax - the rules of the language\n• Variables - containers for data\n• Functions - reusable blocks of code\n\nJavaScript is beginner-friendly, widely used, and has a large community for support.",
        codeExample: "// Your first JavaScript program\nconsole.log('Hello, World!');\nconsole.log('Welcome to programming!');",
        difficulty: "beginner",
        category: "fundamentals",
        order: 1,
        isCompleted: false,
      },
      {
        id: "2",
        title: "Setting Up Your Environment",
        description: "Understanding the development environment and browser console",
        content: "Before writing code, you need to understand where JavaScript runs:\n\n• Browser Console - press F12 or right-click → Inspect\n• Code Editors - VS Code, Atom, or online editors\n• Running code - in browser console or HTML file\n\nThe browser console is perfect for practicing JavaScript. You can type code and see results immediately.\n\nBasic commands:\n• console.log() - displays output\n• console.error() - shows errors\n• console.warn() - displays warnings",
        codeExample: "// Try these in your browser console\nconsole.log('Testing my setup');\nconsole.log(2 + 3);\nconsole.log('Current time:', new Date());",
        difficulty: "beginner",
        category: "fundamentals",
        order: 2,
        isCompleted: false,
      },
      {
        id: "3",
        title: "Variables and Data Storage",
        description: "Learning to store and manage data with variables",
        content: "Variables are containers that store data values. Think of them as labeled boxes where you can put different types of information.\n\nThree ways to declare variables:\n• let - for values that can change\n• const - for values that stay the same\n• var - older way (avoid in modern code)\n\nNaming rules:\n• Start with letter, underscore, or $\n• Can contain letters, numbers, underscore, $\n• Case sensitive (name ≠ Name)\n• Use descriptive names",
        codeExample: "// Declaring variables\nlet userName = 'Alice';\nconst userAge = 25;\nlet isLoggedIn = true;\n\n// Using variables\nconsole.log('User:', userName);\nconsole.log('Age:', userAge);\nconsole.log('Logged in:', isLoggedIn);",
        difficulty: "beginner",
        category: "fundamentals",
        order: 3,
        isCompleted: false,
      },
      {
        id: "4",
        title: "Data Types Explained",
        description: "Understanding different types of data in JavaScript",
        content: "JavaScript has several data types to represent different kinds of information:\n\nPrimitive types:\n• Number - integers and decimals (42, 3.14)\n• String - text in quotes ('hello', \"world\")\n• Boolean - true or false values\n• Undefined - variable declared but no value\n• Null - intentionally empty value\n\nYou can check data types using typeof operator.",
        codeExample: "// Different data types\nlet age = 25;                // Number\nlet name = 'John';           // String\nlet isStudent = true;        // Boolean\nlet address;                 // Undefined\nlet middleName = null;       // Null\n\n// Check types\nconsole.log(typeof age);     // 'number'\nconsole.log(typeof name);    // 'string'\nconsole.log(typeof isStudent); // 'boolean'",
        difficulty: "beginner",
        category: "fundamentals",
        order: 4,
        isCompleted: false,
      },
      {
        id: "5",
        title: "Working with Numbers",
        description: "Mathematical operations and number manipulation",
        content: "Numbers in JavaScript can be integers (whole numbers) or floating-point (decimals). You can perform mathematical operations using operators.\n\nArithmetic operators:\n• + addition\n• - subtraction\n• * multiplication\n• / division\n• % modulus (remainder)\n• ** exponentiation\n\nJavaScript also has useful math functions in the Math object.",
        codeExample: "// Basic math operations\nlet a = 10;\nlet b = 3;\n\nconsole.log(a + b);    // 13\nconsole.log(a - b);    // 7\nconsole.log(a * b);    // 30\nconsole.log(a / b);    // 3.333...\nconsole.log(a % b);    // 1\nconsole.log(a ** b);   // 1000\n\n// Math functions\nconsole.log(Math.round(3.7));  // 4\nconsole.log(Math.max(5, 10));  // 10",
        difficulty: "beginner",
        category: "fundamentals",
        order: 5,
        isCompleted: false,
      },
      {
        id: "6",
        title: "Working with Strings",
        description: "Text manipulation and string operations",
        content: "Strings represent text data. You can create them using single quotes, double quotes, or backticks (template literals).\n\nCommon string operations:\n• Concatenation - joining strings\n• Length - counting characters\n• Methods - built-in string functions\n• Template literals - embedding variables\n\nStrings are immutable - they don't change, operations create new strings.",
        codeExample: "// String basics\nlet firstName = 'John';\nlet lastName = \"Doe\";\nlet greeting = `Hello, ${firstName} ${lastName}!`;\n\nconsole.log(greeting);                    // Hello, John Doe!\nconsole.log(firstName.length);            // 4\nconsole.log(firstName.toUpperCase());     // JOHN\nconsole.log(lastName.toLowerCase());      // doe\nconsole.log(firstName + ' ' + lastName);  // John Doe",
        difficulty: "beginner",
        category: "fundamentals",
        order: 6,
        isCompleted: false,
      },
      {
        id: "7",
        title: "Conditional Statements",
        description: "Making decisions in your code with if/else statements",
        content: "Conditional statements let your program make decisions based on different situations. They use comparison operators to test conditions.\n\nComparison operators:\n• === equal value and type\n• !== not equal\n• > greater than\n• < less than\n• >= greater than or equal\n• <= less than or equal\n\nLogical operators:\n• && (and) - both conditions true\n• || (or) - at least one condition true\n• ! (not) - opposite of condition",
        codeExample: "// Conditional statements\nlet age = 18;\nlet hasLicense = true;\n\nif (age >= 18 && hasLicense) {\n  console.log('Can drive!');\n} else if (age >= 18) {\n  console.log('Old enough, but need license');\n} else {\n  console.log('Too young to drive');\n}\n\n// Ternary operator (shorthand)\nlet message = age >= 18 ? 'Adult' : 'Minor';\nconsole.log(message);",
        difficulty: "beginner",
        category: "fundamentals",
        order: 7,
        isCompleted: false,
      },
      {
        id: "8",
        title: "Introduction to Functions",
        description: "Creating reusable blocks of code with functions",
        content: "Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.\n\nFunction components:\n• Function name - what to call it\n• Parameters - input values\n• Function body - code to execute\n• Return value - output (optional)\n\nFunction declaration syntax:\nfunction functionName(parameters) {\n  // code to execute\n  return value; // optional\n}",
        codeExample: "// Function declaration\nfunction greetUser(name, age) {\n  return `Hello ${name}, you are ${age} years old!`;\n}\n\n// Calling the function\nlet message = greetUser('Alice', 25);\nconsole.log(message);\n\n// Function without return\nfunction displayInfo(name) {\n  console.log('Name:', name);\n  console.log('Welcome to our app!');\n}\n\ndisplayInfo('Bob');",
        difficulty: "beginner",
        category: "fundamentals",
        order: 8,
        isCompleted: false,
      },
      {
        id: "9",
        title: "Function Parameters and Return",
        description: "Understanding function inputs and outputs",
        content: "Functions can accept inputs (parameters) and provide outputs (return values). This makes them flexible and powerful.\n\nKey concepts:\n• Parameters - variables in function definition\n• Arguments - actual values passed to function\n• Return statement - sends value back to caller\n• Scope - where variables can be accessed\n\nFunctions without return statement return 'undefined'.",
        codeExample: "// Function with multiple parameters\nfunction calculateArea(width, height) {\n  let area = width * height;\n  return area;\n}\n\n// Function with default parameters\nfunction greet(name = 'Guest') {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(calculateArea(5, 3));  // 15\nconsole.log(greet());             // Hello, Guest!\nconsole.log(greet('Alice'));      // Hello, Alice!",
        difficulty: "beginner",
        category: "fundamentals",
        order: 9,
        isCompleted: false,
      },
      {
        id: "10",
        title: "Introduction to Arrays",
        description: "Storing multiple values in ordered lists",
        content: "Arrays are ordered lists that can store multiple values. They're perfect for managing collections of related data.\n\nArray characteristics:\n• Ordered - items have positions (indexes)\n• Zero-indexed - first item is at position 0\n• Dynamic - can grow and shrink\n• Mixed types - can store different data types\n\nCommon use cases: lists of names, numbers, products, etc.",
        codeExample: "// Creating arrays\nlet fruits = ['apple', 'banana', 'orange'];\nlet numbers = [1, 2, 3, 4, 5];\nlet mixed = ['Alice', 25, true, null];\n\n// Accessing elements\nconsole.log(fruits[0]);        // 'apple'\nconsole.log(fruits[1]);        // 'banana'\nconsole.log(fruits.length);    // 3\n\n// Adding elements\nfruits.push('grape');\nconsole.log(fruits);           // ['apple', 'banana', 'orange', 'grape']",
        difficulty: "beginner",
        category: "fundamentals",
        order: 10,
        isCompleted: false,
      },
      {
        id: "11",
        title: "Array Methods and Manipulation",
        description: "Adding, removing, and modifying array elements",
        content: "Arrays come with built-in methods for manipulation. These methods make it easy to add, remove, and modify elements.\n\nCommon array methods:\n• push() - add to end\n• pop() - remove from end\n• unshift() - add to beginning\n• shift() - remove from beginning\n• splice() - add/remove at any position\n• slice() - create copy of portion",
        codeExample: "let fruits = ['apple', 'banana'];\n\n// Adding elements\nfruits.push('orange');           // Add to end\nfruits.unshift('grape');         // Add to beginning\nconsole.log(fruits);             // ['grape', 'apple', 'banana', 'orange']\n\n// Removing elements\nlet lastFruit = fruits.pop();    // Remove from end\nlet firstFruit = fruits.shift(); // Remove from beginning\nconsole.log(lastFruit);          // 'orange'\nconsole.log(fruits);             // ['apple', 'banana']",
        difficulty: "beginner",
        category: "fundamentals",
        order: 11,
        isCompleted: false,
      },
      {
        id: "12",
        title: "Loops - Repeating Actions",
        description: "Using loops to repeat code efficiently",
        content: "Loops allow you to repeat code multiple times without writing it repeatedly. There are different types of loops for different situations.\n\nTypes of loops:\n• for loop - when you know how many times\n• while loop - when condition is true\n• for...of loop - iterate through arrays\n• for...in loop - iterate through object properties\n\nLoops help process arrays, repeat actions, and handle repetitive tasks.",
        codeExample: "// For loop - counting\nfor (let i = 1; i <= 5; i++) {\n  console.log('Count:', i);\n}\n\n// For...of loop - array iteration\nlet fruits = ['apple', 'banana', 'orange'];\nfor (let fruit of fruits) {\n  console.log('Fruit:', fruit);\n}\n\n// While loop - condition-based\nlet count = 0;\nwhile (count < 3) {\n  console.log('Loop:', count);\n  count++;\n}",
        difficulty: "beginner",
        category: "fundamentals",
        order: 12,
        isCompleted: false,
      },
      {
        id: "13",
        title: "Introduction to Objects",
        description: "Storing related data with properties and methods",
        content: "Objects are collections of key-value pairs that represent entities or concepts. They're perfect for grouping related information.\n\nObject characteristics:\n• Properties - data stored in the object\n• Methods - functions that belong to the object\n• Dot notation - accessing properties (object.property)\n• Bracket notation - accessing with variables\n\nObjects model real-world entities like users, products, or settings.",
        codeExample: "// Creating an object\nlet person = {\n  name: 'Alice',\n  age: 25,\n  city: 'New York',\n  isEmployed: true\n};\n\n// Accessing properties\nconsole.log(person.name);        // 'Alice'\nconsole.log(person['age']);      // 25\n\n// Adding properties\nperson.email = 'alice@email.com';\nperson.greet = function() {\n  return `Hi, I'm ${this.name}`;\n};\n\nconsole.log(person.greet());     // Hi, I'm Alice",
        difficulty: "beginner",
        category: "fundamentals",
        order: 13,
        isCompleted: false,
      },
      {
        id: "14",
        title: "Working with Object Properties",
        description: "Accessing, modifying, and managing object data",
        content: "Objects are dynamic - you can add, modify, and remove properties at any time. This flexibility makes objects very useful for managing data.\n\nProperty operations:\n• Access - get property values\n• Modify - change existing properties\n• Add - create new properties\n• Delete - remove properties\n• Check existence - test if property exists\n\nUse bracket notation when property names have spaces or are variables.",
        codeExample: "let car = {\n  brand: 'Toyota',\n  model: 'Camry',\n  year: 2020\n};\n\n// Modifying properties\ncar.year = 2021;\ncar.color = 'blue';\n\n// Checking if property exists\nconsole.log('brand' in car);     // true\nconsole.log(car.hasOwnProperty('model')); // true\n\n// Deleting properties\ndelete car.color;\n\n// Dynamic property access\nlet prop = 'brand';\nconsole.log(car[prop]);          // 'Toyota'",
        difficulty: "beginner",
        category: "fundamentals",
        order: 14,
        isCompleted: false,
      },
      {
        id: "15",
        title: "Debugging and Error Handling",
        description: "Finding and fixing problems in your code",
        content: "Debugging is the process of finding and fixing errors in your code. It's a crucial skill for every programmer.\n\nCommon error types:\n• Syntax errors - code structure problems\n• Runtime errors - errors during execution\n• Logic errors - code works but gives wrong results\n\nDebugging tools:\n• console.log() - display values\n• Browser DevTools - step through code\n• Error messages - read and understand them",
        codeExample: "// Common debugging techniques\nfunction calculateDiscount(price, discount) {\n  console.log('Input price:', price);\n  console.log('Input discount:', discount);\n  \n  if (typeof price !== 'number' || typeof discount !== 'number') {\n    console.error('Invalid input: both parameters must be numbers');\n    return null;\n  }\n  \n  let result = price * (1 - discount / 100);\n  console.log('Calculated result:', result);\n  return result;\n}\n\ncalculateDiscount(100, 20); // 80",
        difficulty: "beginner",
        category: "fundamentals",
        order: 15,
        isCompleted: false,
      },

      // INTERMEDIATE LEVEL (16-30)
      {
        id: "16",
        title: "Advanced Array Methods",
        description: "Powerful array operations with map, filter, and reduce",
        content: "JavaScript arrays have powerful methods that make data manipulation easier and more readable. These functional programming methods create new arrays rather than modifying existing ones.\n\nKey methods:\n• map() - transform each element\n• filter() - select elements that meet criteria\n• reduce() - combine elements into single value\n• find() - locate specific element\n• forEach() - perform action on each element\n\nThese methods make code more declarative and easier to understand.",
        codeExample: "let numbers = [1, 2, 3, 4, 5];\n\n// Map - transform elements\nlet doubled = numbers.map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10]\n\n// Filter - select elements\nlet evens = numbers.filter(n => n % 2 === 0);\nconsole.log(evens); // [2, 4]\n\n// Reduce - combine elements\nlet sum = numbers.reduce((total, n) => total + n, 0);\nconsole.log(sum); // 15\n\n// Find - locate element\nlet found = numbers.find(n => n > 3);\nconsole.log(found); // 4",
        difficulty: "intermediate",
        category: "arrays",
        order: 16,
        isCompleted: false,
      },
      {
        id: "17",
        title: "Arrow Functions",
        description: "Modern function syntax and lexical scoping",
        content: "Arrow functions provide a concise syntax for writing functions. They're especially useful for short functions and callbacks.\n\nArrow function syntax:\n• () => expression\n• (param) => expression\n• (param1, param2) => expression\n• (param) => { statements }\n\nKey differences from regular functions:\n• Shorter syntax\n• Lexical 'this' binding\n• Cannot be used as constructors\n• Perfect for callbacks and functional programming",
        codeExample: "// Regular function vs Arrow function\nconst regularFunction = function(x) {\n  return x * 2;\n};\n\nconst arrowFunction = x => x * 2;\n\n// Multiple parameters\nconst add = (a, b) => a + b;\n\n// Block body\nconst processData = data => {\n  console.log('Processing:', data);\n  return data.toUpperCase();\n};\n\n// Using with array methods\nlet numbers = [1, 2, 3, 4, 5];\nlet squared = numbers.map(n => n * n);\nconsole.log(squared); // [1, 4, 9, 16, 25]",
        difficulty: "intermediate",
        category: "functions",
        order: 17,
        isCompleted: false,
      },
      {
        id: "18",
        title: "Destructuring Assignment",
        description: "Extracting values from arrays and objects efficiently",
        content: "Destructuring allows you to extract multiple values from arrays or objects in a single statement. It makes code cleaner and more readable.\n\nArray destructuring:\n• Extract elements by position\n• Skip elements with commas\n• Rest operator for remaining elements\n\nObject destructuring:\n• Extract properties by name\n• Rename variables\n• Default values for missing properties",
        codeExample: "// Array destructuring\nlet colors = ['red', 'green', 'blue', 'yellow'];\nlet [first, second, , fourth] = colors;\nconsole.log(first, second, fourth); // red green yellow\n\n// Object destructuring\nlet person = { name: 'Alice', age: 25, city: 'NYC' };\nlet { name, age, country = 'USA' } = person;\nconsole.log(name, age, country); // Alice 25 USA\n\n// Function parameters\nfunction greetUser({ name, age }) {\n  return `Hello ${name}, you are ${age} years old`;\n}\n\nconsole.log(greetUser(person)); // Hello Alice, you are 25 years old",
        difficulty: "intermediate",
        category: "syntax",
        order: 18,
        isCompleted: false,
      },
      {
        id: "19",
        title: "Template Literals and String Methods",
        description: "Advanced string manipulation and formatting",
        content: "Template literals provide powerful string formatting capabilities. Combined with string methods, they enable sophisticated text processing.\n\nTemplate literal features:\n• Multi-line strings\n• Expression interpolation\n• Tagged templates\n• Raw strings\n\nUseful string methods:\n• split() - convert to array\n• join() - combine array to string\n• trim() - remove whitespace\n• replace() - substitute text",
        codeExample: "// Template literals\nlet name = 'Alice';\nlet age = 25;\n\nlet message = `\n  Hello ${name}!\n  You are ${age} years old.\n  Next year you'll be ${age + 1}.\n`;\n\nconsole.log(message);\n\n// String methods\nlet text = '  JavaScript is awesome!  ';\nconsole.log(text.trim());                    // 'JavaScript is awesome!'\nconsole.log(text.split(' '));               // ['', '', 'JavaScript', 'is', 'awesome!', '', '']\nconsole.log(text.replace('awesome', 'fun')); // '  JavaScript is fun!  '\n\n// Complex formatting\nlet price = 29.99;\nlet formatted = `Price: $${price.toFixed(2)}`;\nconsole.log(formatted); // Price: $29.99",
        difficulty: "intermediate",
        category: "strings",
        order: 19,
        isCompleted: false,
      },
      {
        id: "20",
        title: "Scope and Closures",
        description: "Understanding variable scope and closure patterns",
        content: "Scope determines where variables can be accessed in your code. Closures are a powerful feature that allows functions to access variables from their outer scope.\n\nScope types:\n• Global scope - accessible everywhere\n• Function scope - accessible within function\n• Block scope - accessible within block (let/const)\n\nClosures enable:\n• Private variables\n• Function factories\n• Module patterns\n• Callback functions that remember context",
        codeExample: "// Scope example\nlet globalVar = 'I am global';\n\nfunction outerFunction(x) {\n  let outerVar = 'I am outer';\n  \n  function innerFunction(y) {\n    let innerVar = 'I am inner';\n    console.log(globalVar, outerVar, innerVar, x, y);\n  }\n  \n  return innerFunction; // Returns closure\n}\n\n// Closure in action\nlet myClosure = outerFunction('outer param');\nmyClosure('inner param');\n// Prints: I am global I am outer I am inner outer param inner param\n\n// Practical closure example\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n\nlet counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2",
        difficulty: "intermediate",
        category: "functions",
        order: 20,
        isCompleted: false,
      },
      {
        id: "21",
        title: "DOM Manipulation Basics",
        description: "Interacting with web page elements using JavaScript",
        content: "The Document Object Model (DOM) represents the structure of a web page. JavaScript can manipulate the DOM to create dynamic, interactive websites.\n\nKey DOM concepts:\n• Elements - HTML tags as objects\n• Selectors - finding elements\n• Properties - element attributes\n• Events - user interactions\n\nCommon DOM operations:\n• Select elements\n• Modify content and styles\n• Add/remove elements\n• Handle user events",
        codeExample: "// Selecting elements\nlet title = document.getElementById('title');\nlet buttons = document.querySelectorAll('.button');\nlet firstButton = document.querySelector('.button');\n\n// Modifying content\ntitle.textContent = 'New Title';\ntitle.innerHTML = '<strong>Bold Title</strong>';\n\n// Modifying styles\ntitle.style.color = 'blue';\ntitle.style.fontSize = '24px';\ntitle.classList.add('highlight');\n\n// Creating elements\nlet newParagraph = document.createElement('p');\nnewParagraph.textContent = 'This is a new paragraph';\ndocument.body.appendChild(newParagraph);\n\n// Event handling\nfirstButton.addEventListener('click', function() {\n  alert('Button clicked!');\n});",
        difficulty: "intermediate",
        category: "dom",
        order: 21,
        isCompleted: false,
      },
      {
        id: "22",
        title: "Event Handling and User Interaction",
        description: "Responding to user actions with event listeners",
        content: "Events allow your web page to respond to user interactions like clicks, key presses, and mouse movements. Event handling is crucial for creating interactive applications.\n\nCommon events:\n• click - mouse click\n• keydown/keyup - keyboard input\n• submit - form submission\n• load - page/image loading\n• scroll - page scrolling\n\nEvent object provides details about what happened and allows you to control the default behavior.",
        codeExample: "// Basic event handling\nlet button = document.querySelector('#myButton');\nbutton.addEventListener('click', handleClick);\n\nfunction handleClick(event) {\n  console.log('Button clicked!');\n  console.log('Event type:', event.type);\n  console.log('Target element:', event.target);\n}\n\n// Form handling\nlet form = document.querySelector('#myForm');\nform.addEventListener('submit', function(event) {\n  event.preventDefault(); // Stop form from submitting\n  let formData = new FormData(form);\n  console.log('Form data:', Object.fromEntries(formData));\n});\n\n// Keyboard events\ndocument.addEventListener('keydown', function(event) {\n  if (event.key === 'Escape') {\n    console.log('Escape key pressed!');\n  }\n});",
        difficulty: "intermediate",
        category: "dom",
        order: 22,
        isCompleted: false,
      },
      {
        id: "23",
        title: "Asynchronous JavaScript - Promises",
        description: "Handling asynchronous operations with Promises",
        content: "JavaScript is single-threaded, but it can handle asynchronous operations like API calls, file reading, and timers. Promises provide a clean way to manage asynchronous code.\n\nPromise states:\n• Pending - operation in progress\n• Fulfilled - operation completed successfully\n• Rejected - operation failed\n\nPromise methods:\n• .then() - handle success\n• .catch() - handle errors\n• .finally() - runs regardless of outcome\n• Promise.all() - wait for multiple promises",
        codeExample: "// Creating a Promise\nfunction fetchUserData(userId) {\n  return new Promise((resolve, reject) => {\n    // Simulate API call\n    setTimeout(() => {\n      if (userId > 0) {\n        resolve({ id: userId, name: 'Alice', email: 'alice@example.com' });\n      } else {\n        reject(new Error('Invalid user ID'));\n      }\n    }, 1000);\n  });\n}\n\n// Using Promises\nfetchUserData(1)\n  .then(user => {\n    console.log('User data:', user);\n    return user.name;\n  })\n  .then(name => {\n    console.log('User name:', name);\n  })\n  .catch(error => {\n    console.error('Error:', error.message);\n  });",
        difficulty: "intermediate",
        category: "async",
        order: 23,
        isCompleted: false,
      },
      {
        id: "24",
        title: "Async/Await Syntax",
        description: "Modern asynchronous programming with async/await",
        content: "Async/await provides a more readable way to work with Promises. It makes asynchronous code look and behave more like synchronous code.\n\nKey concepts:\n• async function - returns a Promise\n• await keyword - waits for Promise to resolve\n• Error handling with try/catch\n• Sequential vs parallel execution\n\nAsync/await is syntactic sugar over Promises but makes code much more readable and maintainable.",
        codeExample: "// Async function\nasync function getUserData(userId) {\n  try {\n    console.log('Fetching user data...');\n    let user = await fetchUserData(userId);\n    console.log('User found:', user.name);\n    \n    // Can await multiple operations\n    let posts = await fetchUserPosts(userId);\n    console.log('Posts count:', posts.length);\n    \n    return { user, posts };\n  } catch (error) {\n    console.error('Failed to get user data:', error.message);\n    throw error;\n  }\n}\n\n// Using async function\nasync function main() {\n  try {\n    let data = await getUserData(1);\n    console.log('Complete data:', data);\n  } catch (error) {\n    console.log('Handling error in main:', error.message);\n  }\n}\n\nmain();",
        difficulty: "intermediate",
        category: "async",
        order: 24,
        isCompleted: false,
      },
      {
        id: "25",
        title: "Fetch API and HTTP Requests",
        description: "Making HTTP requests to APIs and servers",
        content: "The Fetch API provides a modern way to make HTTP requests. It's used to communicate with servers, load data from APIs, and submit forms.\n\nFetch features:\n• Promise-based\n• Request/Response objects\n• Support for all HTTP methods\n• Request/Response headers\n• JSON parsing\n• Error handling\n\nCommon use cases: loading data, submitting forms, uploading files, authentication.",
        codeExample: "// Basic GET request\nasync function loadUsers() {\n  try {\n    let response = await fetch('https://jsonplaceholder.typicode.com/users');\n    \n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    \n    let users = await response.json();\n    console.log('Users loaded:', users.length);\n    return users;\n  } catch (error) {\n    console.error('Failed to load users:', error);\n  }\n}\n\n// POST request with data\nasync function createUser(userData) {\n  try {\n    let response = await fetch('https://jsonplaceholder.typicode.com/users', {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify(userData)\n    });\n    \n    let result = await response.json();\n    console.log('User created:', result);\n  } catch (error) {\n    console.error('Failed to create user:', error);\n  }\n}",
        difficulty: "intermediate",
        category: "async",
        order: 25,
        isCompleted: false,
      },
      {
        id: "26",
        title: "Error Handling Patterns",
        description: "Comprehensive error handling strategies",
        content: "Proper error handling is crucial for robust applications. JavaScript provides several mechanisms for catching and handling errors gracefully.\n\nError handling approaches:\n• try/catch blocks - synchronous errors\n• Promise .catch() - Promise rejections\n• async/await with try/catch\n• Global error handlers\n• Custom error types\n\nBest practices:\n• Fail fast and fail clearly\n• Provide meaningful error messages\n• Log errors for debugging\n• Graceful degradation",
        codeExample: "// Custom error class\nclass ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n\n// Function with comprehensive error handling\nasync function processUserData(userData) {\n  try {\n    // Validation\n    if (!userData.email) {\n      throw new ValidationError('Email is required', 'email');\n    }\n    \n    // API call\n    let response = await fetch('/api/users', {\n      method: 'POST',\n      body: JSON.stringify(userData)\n    });\n    \n    if (!response.ok) {\n      throw new Error(`Server error: ${response.status}`);\n    }\n    \n    return await response.json();\n    \n  } catch (error) {\n    if (error instanceof ValidationError) {\n      console.error(`Validation error in ${error.field}: ${error.message}`);\n    } else {\n      console.error('Unexpected error:', error.message);\n    }\n    throw error; // Re-throw for caller to handle\n  }\n}",
        difficulty: "intermediate",
        category: "error-handling",
        order: 26,
        isCompleted: false,
      },
      {
        id: "27",
        title: "Local Storage and Session Storage",
        description: "Persisting data in the browser",
        content: "Web Storage APIs allow you to store data in the user's browser. This enables offline functionality and persisting user preferences.\n\nStorage types:\n• localStorage - persists until manually cleared\n• sessionStorage - cleared when tab closes\n• Both limited to ~5-10MB per origin\n• Store strings only (use JSON for objects)\n\nCommon uses: user preferences, form data, offline caching, shopping carts.",
        codeExample: "// Working with localStorage\n// Storing data\nlocalStorage.setItem('username', 'alice');\nlocalStorage.setItem('theme', 'dark');\n\n// Storing objects (convert to JSON)\nlet user = { name: 'Alice', age: 25, preferences: ['coding', 'reading'] };\nlocalStorage.setItem('user', JSON.stringify(user));\n\n// Retrieving data\nlet username = localStorage.getItem('username');\nlet storedUser = JSON.parse(localStorage.getItem('user'));\n\nconsole.log('Username:', username);\nconsole.log('User preferences:', storedUser.preferences);\n\n// Check if key exists\nif (localStorage.getItem('theme')) {\n  console.log('Theme setting found');\n}\n\n// Remove data\nlocalStorage.removeItem('username');\n// localStorage.clear(); // Remove all data\n\n// Session storage works the same way\nsessionStorage.setItem('sessionData', 'temporary data');",
        difficulty: "intermediate",
        category: "browser-apis",
        order: 27,
        isCompleted: false,
      },
      {
        id: "28",
        title: "ES6 Modules and Code Organization",
        description: "Organizing code with import/export statements",
        content: "ES6 modules allow you to split your code into separate files and import/export functionality between them. This improves code organization and reusability.\n\nModule benefits:\n• Code organization\n• Reusability\n• Namespace management\n• Dependency management\n• Better maintainability\n\nExport types:\n• Named exports - multiple exports per file\n• Default exports - one main export per file\n• Re-exports - exporting from other modules",
        codeExample: "// utils.js - Utility functions\nexport function formatDate(date) {\n  return date.toLocaleDateString();\n}\n\nexport function calculateAge(birthDate) {\n  return new Date().getFullYear() - birthDate.getFullYear();\n}\n\nexport const API_URL = 'https://api.example.com';\n\n// user.js - User class\nexport default class User {\n  constructor(name, email) {\n    this.name = name;\n    this.email = email;\n  }\n  \n  getDisplayName() {\n    return this.name.toUpperCase();\n  }\n}\n\n// main.js - Using the modules\nimport User from './user.js';\nimport { formatDate, calculateAge, API_URL } from './utils.js';\n\nlet user = new User('Alice', 'alice@example.com');\nconsole.log(user.getDisplayName());\nconsole.log(formatDate(new Date()));\nconsole.log('API URL:', API_URL);",
        difficulty: "intermediate",
        category: "modules",
        order: 28,
        isCompleted: false,
      },
      {
        id: "29",
        title: "Regular Expressions",
        description: "Pattern matching and text processing with RegEx",
        content: "Regular expressions (RegEx) are powerful tools for pattern matching and text manipulation. They're used for validation, searching, and replacing text.\n\nCommon patterns:\n• \\d - digits\n• \\w - word characters\n• \\s - whitespace\n• . - any character\n• * - zero or more\n• + - one or more\n• ? - zero or one\n• [] - character sets\n• () - groups",
        codeExample: "// Creating regular expressions\nlet emailPattern = /^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$/;\nlet phonePattern = /^\\(?(\\d{3})\\)?[-. ]?(\\d{3})[-. ]?(\\d{4})$/;\n\n// Testing patterns\nlet email = 'alice@example.com';\nlet phone = '(555) 123-4567';\n\nconsole.log(emailPattern.test(email));  // true\nconsole.log(phonePattern.test(phone));  // true\n\n// Extracting data\nlet text = 'Contact us at support@company.com or call (555) 123-4567';\nlet emails = text.match(/[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}/g);\nlet phones = text.match(/\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}/g);\n\nconsole.log('Emails found:', emails);\nconsole.log('Phones found:', phones);\n\n// Replacing text\nlet cleaned = text.replace(/\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}/g, '[PHONE]');\nconsole.log(cleaned);",
        difficulty: "intermediate",
        category: "regex",
        order: 29,
        isCompleted: false,
      },
      {
        id: "30",
        title: "Working with Dates and Time",
        description: "Date manipulation and formatting in JavaScript",
        content: "JavaScript's Date object provides functionality for working with dates and times. While powerful, it has some quirks that you need to understand.\n\nDate concepts:\n• Date object represents a moment in time\n• Months are 0-indexed (0 = January)\n• Timezone handling can be tricky\n• Various methods for getting/setting date parts\n• Formatting and parsing dates\n\nCommon operations: creating dates, formatting, calculations, comparisons.",
        codeExample: "// Creating dates\nlet now = new Date();\nlet specificDate = new Date('2024-01-15');\nlet fromComponents = new Date(2024, 0, 15, 14, 30); // Jan 15, 2024 2:30 PM\n\nconsole.log('Now:', now);\nconsole.log('Specific:', specificDate);\n\n// Getting date components\nconsole.log('Year:', now.getFullYear());\nconsole.log('Month:', now.getMonth() + 1); // Add 1 because 0-indexed\nconsole.log('Date:', now.getDate());\nconsole.log('Day of week:', now.getDay()); // 0 = Sunday\n\n// Formatting dates\nconsole.log('ISO string:', now.toISOString());\nconsole.log('Locale string:', now.toLocaleDateString());\nconsole.log('Time string:', now.toLocaleTimeString());\n\n// Date calculations\nlet tomorrow = new Date(now);\ntomorrow.setDate(tomorrow.getDate() + 1);\n\nlet daysDiff = Math.floor((tomorrow - now) / (1000 * 60 * 60 * 24));\nconsole.log('Days difference:', daysDiff);",
        difficulty: "intermediate",
        category: "dates",
        order: 30,
        isCompleted: false,
      },

      // ADVANCED LEVEL (31-40)
      {
        id: "31",
        title: "Advanced Object Patterns",
        description: "Object-oriented programming patterns and techniques",
        content: "Advanced object patterns help create maintainable and scalable applications. These patterns solve common design problems and improve code organization.\n\nKey patterns:\n• Constructor functions\n• Prototypal inheritance\n• Factory functions\n• Object composition\n• Mixin patterns\n• Method chaining\n\nThese patterns form the foundation for understanding JavaScript's object model and modern frameworks.",
        codeExample: "// Constructor function pattern\nfunction User(name, email) {\n  this.name = name;\n  this.email = email;\n  this.loginCount = 0;\n}\n\nUser.prototype.login = function() {\n  this.loginCount++;\n  console.log(`${this.name} logged in. Count: ${this.loginCount}`);\n};\n\n// Factory function pattern\nfunction createUser(name, email) {\n  let loginCount = 0; // Private variable\n  \n  return {\n    name,\n    email,\n    login() {\n      loginCount++;\n      console.log(`${this.name} logged in. Count: ${loginCount}`);\n    },\n    getLoginCount() {\n      return loginCount;\n    }\n  };\n}\n\n// Using the patterns\nlet user1 = new User('Alice', 'alice@example.com');\nuser1.login();\n\nlet user2 = createUser('Bob', 'bob@example.com');\nuser2.login();",
        difficulty: "advanced",
        category: "objects",
        order: 31,
        isCompleted: false,
      },
      {
        id: "32",
        title: "Class Syntax and Inheritance",
        description: "ES6 classes and object-oriented programming",
        content: "ES6 introduced class syntax that provides a cleaner way to create objects and implement inheritance. Classes are syntactic sugar over JavaScript's prototypal inheritance.\n\nClass features:\n• Constructor method\n• Instance methods\n• Static methods\n• Getters and setters\n• Private fields (modern browsers)\n• Inheritance with extends\n• Super keyword for parent access",
        codeExample: "// Base class\nclass Animal {\n  constructor(name, species) {\n    this.name = name;\n    this.species = species;\n  }\n  \n  speak() {\n    console.log(`${this.name} makes a sound`);\n  }\n  \n  static getKingdom() {\n    return 'Animalia';\n  }\n}\n\n// Derived class\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name, 'Canine');\n    this.breed = breed;\n  }\n  \n  speak() {\n    console.log(`${this.name} barks`);\n  }\n  \n  fetch() {\n    console.log(`${this.name} fetches the ball`);\n  }\n}\n\n// Usage\nlet myDog = new Dog('Buddy', 'Golden Retriever');\nmyDog.speak();  // Buddy barks\nmyDog.fetch();  // Buddy fetches the ball\nconsole.log(Animal.getKingdom()); // Animalia",
        difficulty: "advanced",
        category: "classes",
        order: 32,
        isCompleted: false,
      },
      {
        id: "33",
        title: "Advanced Array Operations",
        description: "Complex array manipulations and algorithms",
        content: "Advanced array operations involve combining multiple array methods, implementing algorithms, and handling complex data transformations.\n\nAdvanced techniques:\n• Method chaining\n• Nested array operations\n• Sorting with custom comparators\n• Grouping and aggregation\n• Set operations (union, intersection)\n• Performance considerations\n\nThese skills are essential for data processing and algorithm implementation.",
        codeExample: "// Complex data transformation\nlet employees = [\n  { name: 'Alice', department: 'Engineering', salary: 90000, experience: 5 },\n  { name: 'Bob', department: 'Sales', salary: 70000, experience: 3 },\n  { name: 'Charlie', department: 'Engineering', salary: 95000, experience: 7 },\n  { name: 'Diana', department: 'Sales', salary: 75000, experience: 4 }\n];\n\n// Group by department and calculate average salary\nlet departmentStats = employees\n  .reduce((acc, emp) => {\n    if (!acc[emp.department]) {\n      acc[emp.department] = { total: 0, count: 0, employees: [] };\n    }\n    acc[emp.department].total += emp.salary;\n    acc[emp.department].count++;\n    acc[emp.department].employees.push(emp.name);\n    return acc;\n  }, {})\n  \n// Convert to final format\nlet result = Object.entries(departmentStats).map(([dept, stats]) => ({\n  department: dept,\n  averageSalary: stats.total / stats.count,\n  employeeCount: stats.count,\n  employees: stats.employees\n}));\n\nconsole.log(result);",
        difficulty: "advanced",
        category: "arrays",
        order: 33,
        isCompleted: false,
      },
      {
        id: "34",
        title: "Functional Programming Concepts",
        description: "Pure functions, immutability, and functional patterns",
        content: "Functional programming emphasizes functions as first-class citizens, immutability, and avoiding side effects. These concepts lead to more predictable and testable code.\n\nKey concepts:\n• Pure functions - no side effects\n• Immutability - data doesn't change\n• Higher-order functions - functions that take/return functions\n• Currying - partial application\n• Composition - combining functions\n• Avoiding shared state",
        codeExample: "// Pure functions\nconst add = (a, b) => a + b;\nconst multiply = (a, b) => a * b;\n\n// Higher-order function\nconst createCalculator = (operation) => {\n  return (a, b) => operation(a, b);\n};\n\nconst adder = createCalculator(add);\nconst multiplier = createCalculator(multiply);\n\n// Function composition\nconst compose = (f, g) => (x) => f(g(x));\n\nconst addOne = x => x + 1;\nconst double = x => x * 2;\nconst addOneThenDouble = compose(double, addOne);\n\nconsole.log(addOneThenDouble(3)); // 8\n\n// Currying\nconst curriedAdd = a => b => a + b;\nconst addFive = curriedAdd(5);\nconsole.log(addFive(3)); // 8\n\n// Immutable array operations\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(x => x * 2); // Original array unchanged\nconst evens = numbers.filter(x => x % 2 === 0); // Original array unchanged",
        difficulty: "advanced",
        category: "functional",
        order: 34,
        isCompleted: false,
      },
      {
        id: "35",
        title: "Design Patterns in JavaScript",
        description: "Common design patterns and their implementations",
        content: "Design patterns are proven solutions to common programming problems. They provide templates for writing maintainable and scalable code.\n\nCommon patterns:\n• Module pattern - encapsulation\n• Observer pattern - event handling\n• Factory pattern - object creation\n• Singleton pattern - single instance\n• Strategy pattern - algorithm selection\n• Decorator pattern - extending functionality",
        codeExample: "// Module pattern\nconst UserModule = (function() {\n  let users = [];\n  \n  return {\n    addUser(user) {\n      users.push(user);\n    },\n    getUsers() {\n      return [...users]; // Return copy\n    },\n    getUserCount() {\n      return users.length;\n    }\n  };\n})();\n\n// Observer pattern\nclass EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n  \n  on(event, callback) {\n    if (!this.events[event]) {\n      this.events[event] = [];\n    }\n    this.events[event].push(callback);\n  }\n  \n  emit(event, data) {\n    if (this.events[event]) {\n      this.events[event].forEach(callback => callback(data));\n    }\n  }\n}\n\n// Usage\nlet emitter = new EventEmitter();\nemitter.on('userLogin', (user) => console.log(`${user} logged in`));\nemitter.emit('userLogin', 'Alice');",
        difficulty: "advanced",
        category: "patterns",
        order: 35,
        isCompleted: false,
      },
      {
        id: "36",
        title: "Performance Optimization",
        description: "Optimizing JavaScript code for better performance",
        content: "Performance optimization involves identifying bottlenecks and implementing techniques to make code run faster and use less memory.\n\nOptimization techniques:\n• Algorithm efficiency (Big O)\n• Memory management\n• DOM manipulation optimization\n• Event delegation\n• Debouncing and throttling\n• Lazy loading\n• Code splitting\n• Caching strategies",
        codeExample: "// Debouncing - prevent excessive function calls\nfunction debounce(func, delay) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func.apply(this, args), delay);\n  };\n}\n\n// Usage: search input\nconst searchInput = document.getElementById('search');\nconst debouncedSearch = debounce(function(event) {\n  console.log('Searching for:', event.target.value);\n  // Perform search operation\n}, 300);\n\nsearchInput.addEventListener('input', debouncedSearch);\n\n// Memoization - cache expensive computations\nfunction memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\n// Expensive function\nconst fibonacci = memoize(function(n) {\n  if (n < 2) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n});\n\nconsole.log(fibonacci(40)); // Much faster with memoization",
        difficulty: "advanced",
        category: "performance",
        order: 36,
        isCompleted: false,
      },
      {
        id: "37",
        title: "Web APIs and Browser Features",
        description: "Working with modern browser APIs",
        content: "Modern browsers provide many APIs for accessing device features and enhancing user experience. Understanding these APIs enables you to build rich, interactive applications.\n\nUseful APIs:\n• Geolocation - user location\n• File API - file handling\n• Canvas API - graphics and drawing\n• Web Audio API - sound processing\n• Intersection Observer - scroll detection\n• Service Workers - offline functionality\n• WebSockets - real-time communication",
        codeExample: "// Geolocation API\nif (navigator.geolocation) {\n  navigator.geolocation.getCurrentPosition(\n    function(position) {\n      console.log('Latitude:', position.coords.latitude);\n      console.log('Longitude:', position.coords.longitude);\n    },\n    function(error) {\n      console.error('Geolocation error:', error.message);\n    }\n  );\n}\n\n// Intersection Observer - lazy loading\nconst images = document.querySelectorAll('img[data-src]');\nconst imageObserver = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const img = entry.target;\n      img.src = img.dataset.src;\n      img.removeAttribute('data-src');\n      imageObserver.unobserve(img);\n    }\n  });\n});\n\nimages.forEach(img => imageObserver.observe(img));\n\n// File API - reading uploaded files\nconst fileInput = document.getElementById('fileInput');\nfileInput.addEventListener('change', function(event) {\n  const file = event.target.files[0];\n  if (file) {\n    const reader = new FileReader();\n    reader.onload = function(e) {\n      console.log('File content:', e.target.result);\n    };\n    reader.readAsText(file);\n  }\n});",
        difficulty: "advanced",
        category: "web-apis",
        order: 37,
        isCompleted: false,
      },
      {
        id: "38",
        title: "Testing JavaScript Code",
        description: "Writing and running tests for your JavaScript applications",
        content: "Testing ensures your code works correctly and helps prevent bugs. JavaScript has many testing frameworks and approaches.\n\nTesting concepts:\n• Unit tests - test individual functions\n• Integration tests - test component interaction\n• End-to-end tests - test complete workflows\n• Test-driven development (TDD)\n• Mocking and stubbing\n• Code coverage\n\nPopular tools: Jest, Mocha, Cypress, Testing Library.",
        codeExample: "// Simple testing framework\nfunction test(description, fn) {\n  try {\n    fn();\n    console.log(`✅ ${description}`);\n  } catch (error) {\n    console.log(`❌ ${description}`);\n    console.error(error.message);\n  }\n}\n\nfunction expect(actual) {\n  return {\n    toBe(expected) {\n      if (actual !== expected) {\n        throw new Error(`Expected ${expected} but got ${actual}`);\n      }\n    },\n    toEqual(expected) {\n      if (JSON.stringify(actual) !== JSON.stringify(expected)) {\n        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);\n      }\n    }\n  };\n}\n\n// Function to test\nfunction add(a, b) {\n  return a + b;\n}\n\n// Tests\ntest('add function should add two numbers', () => {\n  expect(add(2, 3)).toBe(5);\n  expect(add(-1, 1)).toBe(0);\n  expect(add(0, 0)).toBe(0);\n});\n\ntest('add function should handle decimals', () => {\n  expect(add(0.1, 0.2)).toBe(0.30000000000000004); // JavaScript precision\n});",
        difficulty: "advanced",
        category: "testing",
        order: 38,
        isCompleted: false,
      },
      {
        id: "39",
        title: "Build Tools and Module Bundlers",
        description: "Understanding modern JavaScript build processes",
        content: "Modern JavaScript development relies on build tools to transform, bundle, and optimize code for production. Understanding these tools is essential for professional development.\n\nBuild tool concepts:\n• Transpilation - converting modern JS to compatible versions\n• Bundling - combining modules into fewer files\n• Minification - reducing file size\n• Tree shaking - removing unused code\n• Hot module replacement - development efficiency\n• Source maps - debugging bundled code\n\nPopular tools: Webpack, Vite, Parcel, Rollup, esbuild.",
        codeExample: "// Example webpack.config.js concepts\nconst config = {\n  entry: './src/index.js',\n  output: {\n    path: './dist',\n    filename: 'bundle.js'\n  },\n  module: {\n    rules: [\n      {\n        test: /\\.js$/,\n        use: 'babel-loader', // Transpile modern JS\n        exclude: /node_modules/\n      },\n      {\n        test: /\\.css$/,\n        use: ['style-loader', 'css-loader'] // Handle CSS\n      }\n    ]\n  },\n  plugins: [\n    // Plugins for optimization, HTML generation, etc.\n  ]\n};\n\n// Package.json scripts\n{\n  \"scripts\": {\n    \"build\": \"webpack --mode=production\",\n    \"dev\": \"webpack serve --mode=development\",\n    \"test\": \"jest\",\n    \"lint\": \"eslint src/\"\n  }\n}\n\n// Modern ES modules work seamlessly with build tools\n// import/export statements are transformed for browser compatibility\nimport { utils } from './utils.js';\nimport React from 'react';\nimport './styles.css';\n\nexport default function App() {\n  return utils.createElement('div', 'Hello World');\n}",
        difficulty: "advanced",
        category: "tooling",
        order: 39,
        isCompleted: false,
      },
      {
        id: "40",
        title: "JavaScript Frameworks Overview",
        description: "Understanding popular JavaScript frameworks and libraries",
        content: "JavaScript frameworks provide structure and tools for building complex applications. Each framework has its own philosophy and use cases.\n\nPopular frameworks:\n• React - component-based UI library\n• Vue - progressive framework\n• Angular - full-featured framework\n• Svelte - compile-time optimization\n• Express - Node.js web framework\n• Next.js - React metaframework\n\nChoosing factors: project size, team expertise, performance requirements, ecosystem.",
        codeExample: "// React component example\nfunction UserProfile({ user }) {\n  const [isEditing, setIsEditing] = useState(false);\n  \n  return (\n    <div className=\"user-profile\">\n      <h2>{user.name}</h2>\n      {isEditing ? (\n        <EditForm user={user} onSave={() => setIsEditing(false)} />\n      ) : (\n        <div>\n          <p>Email: {user.email}</p>\n          <button onClick={() => setIsEditing(true)}>Edit</button>\n        </div>\n      )}\n    </div>\n  );\n}\n\n// Vue component example\nconst UserProfile = {\n  template: `\n    <div class=\"user-profile\">\n      <h2>{{ user.name }}</h2>\n      <p v-if=\"!isEditing\">Email: {{ user.email }}</p>\n      <edit-form v-if=\"isEditing\" :user=\"user\" @save=\"isEditing = false\" />\n      <button @click=\"isEditing = !isEditing\">{{ isEditing ? 'Cancel' : 'Edit' }}</button>\n    </div>\n  `,\n  data() {\n    return {\n      isEditing: false\n    };\n  },\n  props: ['user']\n};",
        difficulty: "advanced",
        category: "frameworks",
        order: 40,
        isCompleted: false,
      },

      // EXPERT LEVEL (41-50)
      {
        id: "41",
        title: "Advanced Algorithms and Data Structures",
        description: "Implementing complex algorithms in JavaScript",
        content: "Understanding algorithms and data structures is crucial for solving complex problems efficiently. This knowledge helps you write optimal code and ace technical interviews.\n\nKey topics:\n• Time and space complexity (Big O)\n• Sorting algorithms (quicksort, mergesort)\n• Search algorithms (binary search, graph traversal)\n• Data structures (trees, graphs, heaps)\n• Dynamic programming\n• Recursion and backtracking\n\nThese concepts are fundamental for senior developer roles.",
        codeExample: "// Binary search implementation\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    \n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  \n  return -1; // Not found\n}\n\n// Graph traversal (BFS)\nfunction breadthFirstSearch(graph, start) {\n  let visited = new Set();\n  let queue = [start];\n  let result = [];\n  \n  while (queue.length > 0) {\n    let node = queue.shift();\n    \n    if (!visited.has(node)) {\n      visited.add(node);\n      result.push(node);\n      \n      // Add neighbors to queue\n      for (let neighbor of graph[node] || []) {\n        if (!visited.has(neighbor)) {\n          queue.push(neighbor);\n        }\n      }\n    }\n  }\n  \n  return result;\n}\n\n// Usage\nlet sortedArray = [1, 3, 5, 7, 9, 11, 13];\nconsole.log(binarySearch(sortedArray, 7)); // 3\n\nlet graph = {\n  A: ['B', 'C'],\n  B: ['A', 'D', 'E'],\n  C: ['A', 'F'],\n  D: ['B'],\n  E: ['B', 'F'],\n  F: ['C', 'E']\n};\nconsole.log(breadthFirstSearch(graph, 'A')); // ['A', 'B', 'C', 'D', 'E', 'F']",
        difficulty: "expert",
        category: "algorithms",
        order: 41,
        isCompleted: false,
      },
      {
        id: "42",
        title: "Memory Management and Garbage Collection",
        description: "Understanding JavaScript memory management",
        content: "JavaScript automatically manages memory, but understanding how it works helps you write efficient code and avoid memory leaks.\n\nMemory concepts:\n• Stack vs Heap memory\n• Garbage collection algorithms\n• Memory leaks and how to prevent them\n• WeakMap and WeakSet for memory-conscious programming\n• Performance monitoring tools\n• Memory profiling\n\nProper memory management is crucial for long-running applications.",
        codeExample: "// Memory leak examples and solutions\n\n// Problem: Event listeners not removed\nclass ComponentWithLeak {\n  constructor() {\n    this.handleClick = this.handleClick.bind(this);\n    document.addEventListener('click', this.handleClick);\n  }\n  \n  handleClick() {\n    console.log('Clicked');\n  }\n  \n  // Missing cleanup!\n}\n\n// Solution: Proper cleanup\nclass ComponentFixed {\n  constructor() {\n    this.handleClick = this.handleClick.bind(this);\n    document.addEventListener('click', this.handleClick);\n  }\n  \n  handleClick() {\n    console.log('Clicked');\n  }\n  \n  destroy() {\n    document.removeEventListener('click', this.handleClick);\n  }\n}\n\n// WeakMap for memory-efficient associations\nconst privateData = new WeakMap();\n\nclass User {\n  constructor(name) {\n    this.name = name;\n    // Store private data without memory leaks\n    privateData.set(this, {\n      password: 'secret',\n      internalId: Math.random()\n    });\n  }\n  \n  getPrivateData() {\n    return privateData.get(this);\n  }\n}\n\n// Memory monitoring\nfunction monitorMemory() {\n  if (performance.memory) {\n    console.log('Used:', performance.memory.usedJSHeapSize);\n    console.log('Total:', performance.memory.totalJSHeapSize);\n    console.log('Limit:', performance.memory.jsHeapSizeLimit);\n  }\n}",
        difficulty: "expert",
        category: "memory",
        order: 42,
        isCompleted: false,
      },
      {
        id: "43",
        title: "Metaprogramming and Reflection",
        description: "Advanced JavaScript language features",
        content: "Metaprogramming allows programs to manipulate themselves or other programs. JavaScript provides powerful metaprogramming capabilities.\n\nMetaprogramming features:\n• Proxies - intercept and customize operations\n• Reflect API - programmatic object manipulation\n• Symbol primitive - unique identifiers\n• eval() and Function constructor\n• Property descriptors\n• Dynamic property access\n\nThese features enable frameworks, libraries, and advanced programming patterns.",
        codeExample: "// Proxy for object validation\nfunction createValidatedUser(rules) {\n  return new Proxy({}, {\n    set(target, property, value) {\n      if (rules[property]) {\n        if (!rules[property](value)) {\n          throw new Error(`Invalid value for ${property}: ${value}`);\n        }\n      }\n      target[property] = value;\n      return true;\n    },\n    \n    get(target, property) {\n      if (property in target) {\n        return target[property];\n      } else {\n        throw new Error(`Property ${property} does not exist`);\n      }\n    }\n  });\n}\n\n// Usage\nconst userRules = {\n  email: value => typeof value === 'string' && value.includes('@'),\n  age: value => typeof value === 'number' && value > 0\n};\n\nconst user = createValidatedUser(userRules);\nuser.email = 'alice@example.com'; // ✓\nuser.age = 25; // ✓\n// user.age = -5; // ✗ Throws error\n\n// Symbol for private properties\nconst _private = Symbol('private');\n\nclass SecureClass {\n  constructor() {\n    this[_private] = {\n      secret: 'This is private'\n    };\n  }\n  \n  getSecret() {\n    return this[_private].secret;\n  }\n}\n\n// Reflect API for programmatic operations\nconst obj = { a: 1, b: 2 };\nconsole.log(Reflect.has(obj, 'a')); // true\nReflect.set(obj, 'c', 3);\nconsole.log(Reflect.ownKeys(obj)); // ['a', 'b', 'c']",
        difficulty: "expert",
        category: "metaprogramming",
        order: 43,
        isCompleted: false,
      },
      {
        id: "44",
        title: "Advanced Async Patterns",
        description: "Complex asynchronous programming patterns",
        content: "Advanced async patterns help manage complex asynchronous operations, handle errors gracefully, and optimize performance.\n\nAdvanced patterns:\n• Promise combinators (all, race, allSettled)\n• Async generators and iterators\n• Concurrent execution control\n• Retry mechanisms\n• Circuit breaker pattern\n• Queue and rate limiting\n• Stream processing\n\nThese patterns are essential for building robust, scalable applications.",
        codeExample: "// Advanced Promise patterns\n\n// Retry mechanism with exponential backoff\nasync function retryWithBackoff(fn, maxRetries = 3) {\n  for (let i = 0; i < maxRetries; i++) {\n    try {\n      return await fn();\n    } catch (error) {\n      if (i === maxRetries - 1) throw error;\n      \n      const delay = Math.pow(2, i) * 1000; // Exponential backoff\n      console.log(`Retry ${i + 1} after ${delay}ms`);\n      await new Promise(resolve => setTimeout(resolve, delay));\n    }\n  }\n}\n\n// Async generator for streaming data\nasync function* fetchDataStream(urls) {\n  for (const url of urls) {\n    try {\n      const response = await fetch(url);\n      const data = await response.json();\n      yield data;\n    } catch (error) {\n      yield { error: error.message, url };\n    }\n  }\n}\n\n// Concurrent execution with limit\nasync function executeWithLimit(tasks, limit = 3) {\n  const results = [];\n  const executing = [];\n  \n  for (const task of tasks) {\n    const promise = task().then(result => {\n      executing.splice(executing.indexOf(promise), 1);\n      return result;\n    });\n    \n    results.push(promise);\n    executing.push(promise);\n    \n    if (executing.length >= limit) {\n      await Promise.race(executing);\n    }\n  }\n  \n  return Promise.all(results);\n}\n\n// Usage\nconst urls = ['url1', 'url2', 'url3'];\nfor await (const data of fetchDataStream(urls)) {\n  console.log('Received:', data);\n}",
        difficulty: "expert",
        category: "async",
        order: 44,
        isCompleted: false,
      },
      {
        id: "45",
        title: "Performance Profiling and Optimization",
        description: "Advanced performance analysis and optimization techniques",
        content: "Performance profiling helps identify bottlenecks and optimize applications for better user experience. Modern tools provide detailed insights into code execution.\n\nProfiling techniques:\n• Chrome DevTools performance analysis\n• Memory leak detection\n• CPU profiling\n• Network optimization\n• Bundle analysis\n• Lighthouse audits\n• Core Web Vitals\n\nOptimization strategies depend on specific bottlenecks and use cases.",
        codeExample: "// Performance measurement and optimization\n\n// Performance measurement\nfunction measurePerformance(fn, name) {\n  return function(...args) {\n    const start = performance.now();\n    const result = fn.apply(this, args);\n    const end = performance.now();\n    console.log(`${name} took ${end - start} milliseconds`);\n    return result;\n  };\n}\n\n// Optimized data structure operations\nclass OptimizedMap {\n  constructor() {\n    this.map = new Map();\n    this.keyOrder = [];\n  }\n  \n  set(key, value) {\n    if (!this.map.has(key)) {\n      this.keyOrder.push(key);\n    }\n    this.map.set(key, value);\n  }\n  \n  // O(1) access to first/last elements\n  getFirst() {\n    return this.map.get(this.keyOrder[0]);\n  }\n  \n  getLast() {\n    return this.map.get(this.keyOrder[this.keyOrder.length - 1]);\n  }\n}\n\n// Virtual scrolling for large lists\nclass VirtualList {\n  constructor(container, itemHeight, totalItems) {\n    this.container = container;\n    this.itemHeight = itemHeight;\n    this.totalItems = totalItems;\n    this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2;\n    this.startIndex = 0;\n    \n    this.setupScrolling();\n  }\n  \n  setupScrolling() {\n    this.container.addEventListener('scroll', () => {\n      const scrollTop = this.container.scrollTop;\n      const newStartIndex = Math.floor(scrollTop / this.itemHeight);\n      \n      if (newStartIndex !== this.startIndex) {\n        this.startIndex = newStartIndex;\n        this.renderVisibleItems();\n      }\n    });\n  }\n  \n  renderVisibleItems() {\n    // Only render visible items instead of all items\n    const endIndex = Math.min(this.startIndex + this.visibleItems, this.totalItems);\n    // Rendering logic here...\n  }\n}\n\n// Bundle size optimization\n// Use dynamic imports for code splitting\nasync function loadFeature() {\n  const { AdvancedFeature } = await import('./advanced-feature.js');\n  return new AdvancedFeature();\n}",
        difficulty: "expert",
        category: "performance",
        order: 45,
        isCompleted: false,
      },
      {
        id: "46",
        title: "Architecture Patterns for Large Applications",
        description: "Designing scalable JavaScript application architectures",
        content: "Large applications require well-thought-out architectures to remain maintainable and scalable. Understanding architectural patterns helps you design better systems.\n\nArchitectural patterns:\n• Model-View-Controller (MVC)\n• Model-View-ViewModel (MVVM)\n• Component-based architecture\n• Microservices frontend\n• Event-driven architecture\n• State management patterns\n• Dependency injection\n\nGood architecture reduces complexity and improves maintainability.",
        codeExample: "// Event-driven architecture example\nclass EventBus {\n  constructor() {\n    this.events = {};\n  }\n  \n  subscribe(event, callback) {\n    if (!this.events[event]) {\n      this.events[event] = [];\n    }\n    this.events[event].push(callback);\n    \n    // Return unsubscribe function\n    return () => {\n      this.events[event] = this.events[event].filter(cb => cb !== callback);\n    };\n  }\n  \n  publish(event, data) {\n    if (this.events[event]) {\n      this.events[event].forEach(callback => {\n        try {\n          callback(data);\n        } catch (error) {\n          console.error('Event handler error:', error);\n        }\n      });\n    }\n  }\n}\n\n// Dependency injection container\nclass DIContainer {\n  constructor() {\n    this.services = new Map();\n    this.singletons = new Map();\n  }\n  \n  register(name, factory, { singleton = false } = {}) {\n    this.services.set(name, { factory, singleton });\n  }\n  \n  resolve(name) {\n    const service = this.services.get(name);\n    if (!service) {\n      throw new Error(`Service ${name} not found`);\n    }\n    \n    if (service.singleton) {\n      if (!this.singletons.has(name)) {\n        this.singletons.set(name, service.factory(this));\n      }\n      return this.singletons.get(name);\n    }\n    \n    return service.factory(this);\n  }\n}\n\n// Usage\nconst eventBus = new EventBus();\nconst container = new DIContainer();\n\n// Register services\ncontainer.register('eventBus', () => eventBus, { singleton: true });\ncontainer.register('userService', (container) => {\n  return new UserService(container.resolve('eventBus'));\n});\n\nclass UserService {\n  constructor(eventBus) {\n    this.eventBus = eventBus;\n  }\n  \n  createUser(userData) {\n    // Create user logic\n    this.eventBus.publish('userCreated', userData);\n  }\n}",
        difficulty: "expert",
        category: "architecture",
        order: 46,
        isCompleted: false,
      },
      {
        id: "47",
        title: "Security Best Practices",
        description: "Securing JavaScript applications against common vulnerabilities",
        content: "Security is crucial for web applications. Understanding common vulnerabilities and how to prevent them protects users and businesses.\n\nSecurity topics:\n• Cross-Site Scripting (XSS) prevention\n• Content Security Policy (CSP)\n• Cross-Site Request Forgery (CSRF) protection\n• Input validation and sanitization\n• Authentication and authorization\n• Secure data transmission\n• Dependency security\n\nSecurity should be considered from the beginning of development.",
        codeExample: "// XSS prevention techniques\n\n// 1. HTML escaping\nfunction escapeHtml(text) {\n  const div = document.createElement('div');\n  div.textContent = text;\n  return div.innerHTML;\n}\n\n// 2. Safe DOM manipulation\nfunction safeSetContent(element, content) {\n  // Use textContent instead of innerHTML for user data\n  element.textContent = content;\n}\n\n// 3. Input validation\nclass InputValidator {\n  static email(input) {\n    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n    return emailRegex.test(input) && input.length <= 254;\n  }\n  \n  static sanitizeInput(input) {\n    return input\n      .replace(/[<>\"'&]/g, function(match) {\n        const escape = {\n          '<': '&lt;',\n          '>': '&gt;',\n          '\"': '&quot;',\n          \"'\": '&#x27;',\n          '&': '&amp;'\n        };\n        return escape[match];\n      })\n      .trim()\n      .substring(0, 1000); // Limit length\n  }\n}\n\n// 4. Secure API communication\nclass SecureApiClient {\n  constructor(baseUrl, csrfToken) {\n    this.baseUrl = baseUrl;\n    this.csrfToken = csrfToken;\n  }\n  \n  async request(endpoint, options = {}) {\n    const url = `${this.baseUrl}${endpoint}`;\n    const headers = {\n      'Content-Type': 'application/json',\n      'X-CSRF-Token': this.csrfToken,\n      ...options.headers\n    };\n    \n    const response = await fetch(url, {\n      ...options,\n      headers,\n      credentials: 'same-origin' // Include cookies for same-origin requests\n    });\n    \n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n    }\n    \n    return response.json();\n  }\n}\n\n// 5. Content Security Policy (add to HTML)\n// <meta http-equiv=\"Content-Security-Policy\" \n//       content=\"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';\">\n\n// Usage\nconst userInput = \"<script>alert('xss')</script>\";\nconst safeInput = InputValidator.sanitizeInput(userInput);\nconsole.log(safeInput); // Safe to display",
        difficulty: "expert",
        category: "security",
        order: 47,
        isCompleted: false,
      },
      {
        id: "48",
        title: "Advanced Testing Strategies",
        description: "Comprehensive testing approaches for complex applications",
        content: "Advanced testing strategies ensure application reliability, maintainability, and user satisfaction. Different testing approaches serve different purposes.\n\nTesting strategies:\n• Test-driven development (TDD)\n• Behavior-driven development (BDD)\n• Integration testing strategies\n• End-to-end testing\n• Performance testing\n• Visual regression testing\n• Contract testing\n• Property-based testing\n\nA comprehensive testing strategy combines multiple approaches.",
        codeExample: "// Advanced testing patterns\n\n// 1. Test doubles and mocking\nclass UserService {\n  constructor(apiClient, logger) {\n    this.apiClient = apiClient;\n    this.logger = logger;\n  }\n  \n  async getUser(id) {\n    try {\n      this.logger.info(`Fetching user ${id}`);\n      const user = await this.apiClient.get(`/users/${id}`);\n      return user;\n    } catch (error) {\n      this.logger.error(`Failed to fetch user ${id}:`, error);\n      throw error;\n    }\n  }\n}\n\n// Test with mocks\nfunction testUserService() {\n  const mockApiClient = {\n    get: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' })\n  };\n  \n  const mockLogger = {\n    info: jest.fn(),\n    error: jest.fn()\n  };\n  \n  const userService = new UserService(mockApiClient, mockLogger);\n  \n  test('should fetch user successfully', async () => {\n    const user = await userService.getUser(1);\n    \n    expect(user).toEqual({ id: 1, name: 'Alice' });\n    expect(mockApiClient.get).toHaveBeenCalledWith('/users/1');\n    expect(mockLogger.info).toHaveBeenCalledWith('Fetching user 1');\n  });\n}\n\n// 2. Property-based testing example\nfunction quickCheck(property, generator, iterations = 100) {\n  for (let i = 0; i < iterations; i++) {\n    const input = generator();\n    if (!property(input)) {\n      throw new Error(`Property failed for input: ${JSON.stringify(input)}`);\n    }\n  }\n}\n\n// Test reversibility property\nfunction testStringReverse() {\n  const reverseProperty = (str) => {\n    return reverse(reverse(str)) === str;\n  };\n  \n  const stringGenerator = () => {\n    const chars = 'abcdefghijklmnopqrstuvwxyz';\n    let result = '';\n    for (let i = 0; i < Math.floor(Math.random() * 20); i++) {\n      result += chars[Math.floor(Math.random() * chars.length)];\n    }\n    return result;\n  };\n  \n  quickCheck(reverseProperty, stringGenerator);\n}\n\n// 3. Visual regression testing concept\nclass VisualTester {\n  async captureScreenshot(selector) {\n    // Capture screenshot of element\n    return await page.screenshot({ \n      clip: await page.$(selector).boundingBox() \n    });\n  }\n  \n  async compareWithBaseline(screenshot, baselinePath) {\n    // Compare with stored baseline image\n    const baseline = await fs.readFile(baselinePath);\n    const diff = await imageCompare(screenshot, baseline);\n    return diff.percentage < 0.1; // Allow 0.1% difference\n  }\n}",
        difficulty: "expert",
        category: "testing",
        order: 48,
        isCompleted: false,
      },
      {
        id: "49",
        title: "Advanced Debugging and DevTools",
        description: "Mastering debugging techniques and browser developer tools",
        content: "Advanced debugging skills are essential for solving complex problems efficiently. Modern browser developer tools provide powerful debugging capabilities.\n\nAdvanced debugging:\n• Breakpoint strategies\n• Call stack analysis\n• Memory profiling\n• Performance debugging\n• Network debugging\n• Source map debugging\n• Remote debugging\n• Production debugging\n\nMastering these tools dramatically improves debugging efficiency.",
        codeExample: "// Advanced debugging techniques\n\n// 1. Conditional breakpoints and logging\nfunction debugConditionalBreakpoint(users) {\n  users.forEach((user, index) => {\n    // Set conditional breakpoint: index > 5 && user.age < 18\n    if (user.age < 18) {\n      console.log('Minor user found:', user);\n      // debugger; // Programmatic breakpoint\n    }\n  });\n}\n\n// 2. Performance debugging\nclass PerformanceDebugger {\n  static mark(name) {\n    performance.mark(name);\n  }\n  \n  static measure(name, start, end) {\n    performance.measure(name, start, end);\n    const measure = performance.getEntriesByName(name)[0];\n    console.log(`${name}: ${measure.duration}ms`);\n  }\n  \n  static timeFunction(fn, name) {\n    return function(...args) {\n      const startMark = `${name}-start`;\n      const endMark = `${name}-end`;\n      \n      PerformanceDebugger.mark(startMark);\n      const result = fn.apply(this, args);\n      PerformanceDebugger.mark(endMark);\n      PerformanceDebugger.measure(name, startMark, endMark);\n      \n      return result;\n    };\n  }\n}\n\n// 3. Memory leak detection\nclass MemoryLeakDetector {\n  constructor() {\n    this.references = new Set();\n    this.intervalId = null;\n  }\n  \n  track(obj, name) {\n    this.references.add({ obj: new WeakRef(obj), name });\n  }\n  \n  startMonitoring() {\n    this.intervalId = setInterval(() => {\n      let liveObjects = 0;\n      this.references.forEach(ref => {\n        if (ref.obj.deref()) {\n          liveObjects++;\n        }\n      });\n      console.log(`Live tracked objects: ${liveObjects}`);\n      \n      if (typeof gc === 'function') {\n        gc(); // Force garbage collection in Node.js with --expose-gc\n      }\n    }, 5000);\n  }\n  \n  stopMonitoring() {\n    if (this.intervalId) {\n      clearInterval(this.intervalId);\n    }\n  }\n}\n\n// 4. Error boundary and error reporting\nclass ErrorReporter {\n  static init() {\n    window.addEventListener('error', this.handleError);\n    window.addEventListener('unhandledrejection', this.handleRejection);\n  }\n  \n  static handleError(event) {\n    console.error('Global error:', {\n      message: event.message,\n      filename: event.filename,\n      lineno: event.lineno,\n      colno: event.colno,\n      stack: event.error?.stack\n    });\n  }\n  \n  static handleRejection(event) {\n    console.error('Unhandled promise rejection:', event.reason);\n  }\n}\n\n// Usage\nconst expensiveFunction = PerformanceDebugger.timeFunction(\n  (data) => data.map(x => x * 2),\n  'arrayDoubling'\n);\n\nErrorReporter.init();\nconst detector = new MemoryLeakDetector();\ndetector.startMonitoring();",
        difficulty: "expert",
        category: "debugging",
        order: 49,
        isCompleted: false,
      },
      {
        id: "50",
        title: "Future of JavaScript and Emerging Technologies",
        description: "Staying current with JavaScript evolution and emerging trends",
        content: "JavaScript continues to evolve rapidly. Understanding emerging trends and upcoming features helps you stay ahead in your career.\n\nEmerging trends:\n• WebAssembly integration\n• Edge computing and serverless\n• Progressive Web Apps (PWA)\n• AI/ML in JavaScript\n• Blockchain and Web3\n• IoT with JavaScript\n• Quantum computing interfaces\n• Real-time collaboration tools\n\nContinuous learning is essential in the fast-evolving JavaScript ecosystem.",
        codeExample: "// Future JavaScript features and emerging patterns\n\n// 1. Top-level await (already available)\nconst config = await fetch('/api/config').then(r => r.json());\n\n// 2. Private class fields\nclass ModernClass {\n  #privateField = 'secret';\n  \n  #privateMethod() {\n    return this.#privateField;\n  }\n  \n  getPrivate() {\n    return this.#privateMethod();\n  }\n}\n\n// 3. Optional chaining and nullish coalescing\nconst user = {\n  profile: {\n    preferences: {\n      theme: 'dark'\n    }\n  }\n};\n\nconst theme = user?.profile?.preferences?.theme ?? 'light';\n\n// 4. WebAssembly integration example\nasync function loadWasmModule() {\n  try {\n    const wasmModule = await WebAssembly.instantiateStreaming(\n      fetch('/math-operations.wasm')\n    );\n    \n    // Use WebAssembly function for heavy computation\n    const result = wasmModule.instance.exports.heavyComputation(1000000);\n    return result;\n  } catch (error) {\n    console.error('WebAssembly loading failed:', error);\n    // Fallback to JavaScript implementation\n    return heavyComputationJS(1000000);\n  }\n}\n\n// 5. Service Worker for PWA\nif ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('/sw.js')\n    .then(registration => {\n      console.log('SW registered:', registration);\n    })\n    .catch(error => {\n      console.log('SW registration failed:', error);\n    });\n}\n\n// 6. Web Workers for parallel processing\nclass ParallelProcessor {\n  constructor() {\n    this.workers = [];\n  }\n  \n  async processInParallel(data, workerScript) {\n    const numWorkers = navigator.hardwareConcurrency || 4;\n    const chunkSize = Math.ceil(data.length / numWorkers);\n    \n    const promises = [];\n    \n    for (let i = 0; i < numWorkers; i++) {\n      const worker = new Worker(workerScript);\n      const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);\n      \n      promises.push(new Promise(resolve => {\n        worker.postMessage(chunk);\n        worker.onmessage = e => {\n          resolve(e.data);\n          worker.terminate();\n        };\n      }));\n    }\n    \n    const results = await Promise.all(promises);\n    return results.flat();\n  }\n}\n\n// 7. Emerging AI integration\nclass AIAssistant {\n  async processNaturalLanguage(input) {\n    // Integration with AI APIs\n    const response = await fetch('/api/ai/process', {\n      method: 'POST',\n      body: JSON.stringify({ input }),\n      headers: { 'Content-Type': 'application/json' }\n    });\n    \n    return response.json();\n  }\n}",
        difficulty: "expert",
        category: "future",
        order: 50,
        isCompleted: false,
      }
    ];

    defaultLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Initialize default challenges
    const defaultChallenges: Challenge[] = [
      {
        id: "1",
        title: "Array Manipulation",
        description: "Find the second largest number in an array without sorting",
        difficulty: "medium",
        category: "arrays",
        testCases: [
          { input: [1, 3, 4, 5, 2], expected: 4 },
          { input: [10, 20, 30], expected: 20 },
        ],
        solution: "function findSecondLargest(arr) {\n  let first = arr[0], second = -1;\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > first) {\n      second = first;\n      first = arr[i];\n    } else if (arr[i] > second && arr[i] < first) {\n      second = arr[i];\n    }\n  }\n  return second;\n}",
        hints: ["Think about tracking two variables", "Don't sort the array"],
      },
    ];

    defaultChallenges.forEach(challenge => this.challenges.set(challenge.id, challenge));

    // Initialize sample community posts
    const defaultPosts: CommunityPost[] = [
      {
        id: "1",
        userId: "sample-user",
        title: "Can someone explain the difference between let and const?",
        content: "I'm having trouble understanding when to use let vs const in JavaScript.",
        category: "questions",
        likes: 5,
        replies: 3,
        createdAt: new Date(),
      },
      {
        id: "2",
        userId: "sample-user-2",
        title: "Just completed my first JavaScript project!",
        content: "Thanks to the AI tutor for the helpful explanations.",
        category: "achievements",
        likes: 12,
        replies: 1,
        createdAt: new Date(),
      },
    ];

    defaultPosts.forEach(post => this.communityPosts.set(post.id, post));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      phone: insertUser.phone || null,
      skillLevel: "beginner",
      currentStreak: 0,
      totalLessons: 3,
      completedLessons: 0,
      challengesSolved: 0,
      isEmailVerified: false,
      isPhoneVerified: false,
      emailVerificationToken: null,
      phoneVerificationCode: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = { 
      ...insertLesson, 
      id,
      difficulty: insertLesson.difficulty || "beginner",
      codeExample: insertLesson.codeExample || null,
      isCompleted: insertLesson.isCompleted || false
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson) return undefined;
    
    const updatedLesson = { ...lesson, ...updates };
    this.lessons.set(id, updatedLesson);
    return updatedLesson;
  }

  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getChallengesByDifficulty(difficulty: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(c => c.difficulty === difficulty);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = { 
      ...insertChallenge, 
      id,
      testCases: insertChallenge.testCases || null,
      solution: insertChallenge.solution || null,
      hints: insertChallenge.hints || null
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  // User Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(p => p.userId === userId && p.lessonId === lessonId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { 
      ...insertProgress, 
      id,
      status: insertProgress.status || "not_started",
      lessonId: insertProgress.lessonId || null,
      challengeId: insertProgress.challengeId || null,
      completedAt: insertProgress.completedAt || null,
      score: insertProgress.score || null
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Community methods
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const post: CommunityPost = { 
      ...insertPost, 
      id,
      likes: 0,
      replies: 0,
      createdAt: new Date(),
    };
    this.communityPosts.set(id, post);
    return post;
  }

  async updateCommunityPost(id: string, updates: Partial<CommunityPost>): Promise<CommunityPost | undefined> {
    const post = this.communityPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates };
    this.communityPosts.set(id, updatedPost);
    return updatedPost;
  }

  // AI Session methods
  async getAiSession(id: string): Promise<AiSession | undefined> {
    return this.aiSessions.get(id);
  }

  async getUserAiSessions(userId: string): Promise<AiSession[]> {
    return Array.from(this.aiSessions.values()).filter(s => s.userId === userId);
  }

  async createAiSession(insertSession: InsertAiSession): Promise<AiSession> {
    const id = randomUUID();
    const session: AiSession = { 
      ...insertSession, 
      id,
      context: insertSession.context || null,
      messages: insertSession.messages || null,
      createdAt: new Date(),
    };
    this.aiSessions.set(id, session);
    return session;
  }

  async updateAiSession(id: string, updates: Partial<AiSession>): Promise<AiSession | undefined> {
    const session = this.aiSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.aiSessions.set(id, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
