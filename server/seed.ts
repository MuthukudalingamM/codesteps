import { db } from "./db";
import { lessons, challenges, communityPosts } from "@shared/schema";

export async function seedDatabase() {
  // Only seed if tables are empty
  const existing = await db.select().from(lessons).limit(1);
  if (existing.length > 0) return;

  console.log("🌱 Seeding database with default lessons and challenges...");

  await db.insert(lessons).values([
    { id: "1", title: "What is Programming?", description: "Introduction to programming concepts and JavaScript", content: "Programming is the process of creating instructions for computers to follow. JavaScript is a popular programming language that runs in web browsers and servers. It's used to create interactive websites, mobile apps, and server applications.\n\nKey concepts:\n• Algorithms - step-by-step instructions\n• Syntax - the rules of the language\n• Variables - containers for data\n• Functions - reusable blocks of code\n\nJavaScript is beginner-friendly, widely used, and has a large community for support.", codeExample: "// Your first JavaScript program\nconsole.log('Hello, World!');\nconsole.log('Welcome to programming!');", difficulty: "beginner", category: "fundamentals", order: 1, isCompleted: false },
    { id: "2", title: "Setting Up Your Environment", description: "Understanding the development environment and browser console", content: "Before writing code, you need to understand where JavaScript runs:\n\n• Browser Console - press F12 or right-click → Inspect\n• Code Editors - VS Code, Atom, or online editors\n• Running code - in browser console or HTML file\n\nThe browser console is perfect for practicing JavaScript.", codeExample: "// Try these in your browser console\nconsole.log('Testing my setup');\nconsole.log(2 + 3);\nconsole.log('Current time:', new Date());", difficulty: "beginner", category: "fundamentals", order: 2, isCompleted: false },
    { id: "3", title: "Variables and Data Storage", description: "Learning to store and manage data with variables", content: "Variables are containers that store data values. Think of them as labeled boxes where you can put different types of information.\n\nThree ways to declare variables:\n• let - for values that can change\n• const - for values that stay the same\n• var - older way (avoid in modern code)\n\nNaming rules:\n• Start with letter, underscore, or $\n• Can contain letters, numbers, underscore, $\n• Case sensitive (name ≠ Name)\n• Use descriptive names", codeExample: "// Declaring variables\nlet userName = 'Alice';\nconst userAge = 25;\nlet isLoggedIn = true;\n\n// Using variables\nconsole.log('User:', userName);\nconsole.log('Age:', userAge);\nconsole.log('Logged in:', isLoggedIn);", difficulty: "beginner", category: "fundamentals", order: 3, isCompleted: false },
    { id: "4", title: "Data Types Explained", description: "Understanding different types of data in JavaScript", content: "JavaScript has several data types:\n\nPrimitive types:\n• Number - integers and decimals (42, 3.14)\n• String - text in quotes\n• Boolean - true or false\n• Undefined - declared but no value\n• Null - intentionally empty\n\nUse typeof to check data types.", codeExample: "let age = 25;\nlet name = 'John';\nlet isStudent = true;\nlet address;\nlet middleName = null;\n\nconsole.log(typeof age);\nconsole.log(typeof name);\nconsole.log(typeof isStudent);", difficulty: "beginner", category: "fundamentals", order: 4, isCompleted: false },
    { id: "5", title: "Working with Numbers", description: "Mathematical operations and number manipulation", content: "Numbers in JavaScript can be integers or floating-point. Arithmetic operators:\n• + addition\n• - subtraction\n• * multiplication\n• / division\n• % modulus\n• ** exponentiation", codeExample: "let a = 10;\nlet b = 3;\nconsole.log(a + b);\nconsole.log(a - b);\nconsole.log(a * b);\nconsole.log(a / b);\nconsole.log(a % b);\nconsole.log(Math.round(3.7));\nconsole.log(Math.max(5, 10));", difficulty: "beginner", category: "fundamentals", order: 5, isCompleted: false },
    { id: "6", title: "Working with Strings", description: "Text manipulation and string operations", content: "Strings represent text. Create them with single quotes, double quotes, or backticks.\n\nCommon operations:\n• Concatenation - joining strings\n• Length - counting characters\n• Template literals - embedding variables", codeExample: "let firstName = 'John';\nlet lastName = 'Doe';\nlet greeting = `Hello, ${firstName} ${lastName}!`;\nconsole.log(greeting);\nconsole.log(firstName.length);\nconsole.log(firstName.toUpperCase());", difficulty: "beginner", category: "fundamentals", order: 6, isCompleted: false },
    { id: "7", title: "Conditional Statements", description: "Making decisions in your code with if/else statements", content: "Conditional statements let your program make decisions.\n\nComparison operators:\n• === equal\n• !== not equal\n• > greater than\n• < less than\n\nLogical operators:\n• && and\n• || or\n• ! not", codeExample: "let age = 18;\nlet hasLicense = true;\n\nif (age >= 18 && hasLicense) {\n  console.log('Can drive!');\n} else if (age >= 18) {\n  console.log('Need a license');\n} else {\n  console.log('Too young');\n}", difficulty: "beginner", category: "fundamentals", order: 7, isCompleted: false },
    { id: "8", title: "Introduction to Functions", description: "Creating reusable blocks of code with functions", content: "Functions are reusable blocks of code.\n\nComponents:\n• Function name\n• Parameters - input values\n• Function body\n• Return value (optional)", codeExample: "function greetUser(name, age) {\n  return `Hello ${name}, you are ${age} years old!`;\n}\n\nlet message = greetUser('Alice', 25);\nconsole.log(message);", difficulty: "beginner", category: "fundamentals", order: 8, isCompleted: false },
    { id: "9", title: "Function Parameters and Return", description: "Understanding function inputs and outputs", content: "Functions accept inputs (parameters) and provide outputs (return values).\n\nKey concepts:\n• Parameters vs Arguments\n• Return statement\n• Default parameters\n• Scope", codeExample: "function calculateArea(width, height) {\n  return width * height;\n}\n\nfunction greet(name = 'Guest') {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(calculateArea(5, 3));\nconsole.log(greet());\nconsole.log(greet('Alice'));", difficulty: "beginner", category: "fundamentals", order: 9, isCompleted: false },
    { id: "10", title: "Introduction to Arrays", description: "Storing multiple values in ordered lists", content: "Arrays are ordered lists storing multiple values.\n\nCharacteristics:\n• Zero-indexed - first item at position 0\n• Dynamic - can grow and shrink\n• Mixed types allowed", codeExample: "let fruits = ['apple', 'banana', 'orange'];\nconsole.log(fruits[0]);\nconsole.log(fruits.length);\nfruits.push('grape');\nconsole.log(fruits);", difficulty: "beginner", category: "fundamentals", order: 10, isCompleted: false },
    { id: "11", title: "Array Methods", description: "Adding, removing, and modifying array elements", content: "Common array methods:\n• push() - add to end\n• pop() - remove from end\n• unshift() - add to beginning\n• shift() - remove from beginning\n• splice() - add/remove at position\n• slice() - copy portion", codeExample: "let fruits = ['apple', 'banana'];\nfruits.push('orange');\nfruits.unshift('grape');\nconsole.log(fruits);\nlet last = fruits.pop();\nconsole.log(last);", difficulty: "beginner", category: "fundamentals", order: 11, isCompleted: false },
    { id: "12", title: "Loops - Repeating Actions", description: "Using loops to repeat code efficiently", content: "Loops repeat code multiple times:\n• for loop - known count\n• while loop - condition based\n• for...of - iterate arrays\n• for...in - iterate objects", codeExample: "for (let i = 1; i <= 5; i++) {\n  console.log('Count:', i);\n}\n\nlet fruits = ['apple', 'banana', 'orange'];\nfor (let fruit of fruits) {\n  console.log('Fruit:', fruit);\n}", difficulty: "beginner", category: "fundamentals", order: 12, isCompleted: false },
    { id: "13", title: "Introduction to Objects", description: "Storing related data with properties and methods", content: "Objects are key-value pairs representing entities.\n\nCharacteristics:\n• Properties - stored data\n• Methods - object functions\n• Dot notation - object.property\n• Bracket notation - object['property']", codeExample: "let person = {\n  name: 'Alice',\n  age: 25,\n  city: 'New York'\n};\n\nconsole.log(person.name);\nconsole.log(person['age']);\nperson.email = 'alice@email.com';\nconsole.log(person);", difficulty: "beginner", category: "fundamentals", order: 13, isCompleted: false },
    { id: "14", title: "Object Methods and this", description: "Adding functions to objects and using this keyword", content: "Objects can have methods (functions). The 'this' keyword refers to the current object.\n\nKey concepts:\n• Method definition\n• Using this inside methods\n• Object destructuring", codeExample: "let person = {\n  name: 'Alice',\n  age: 25,\n  greet() {\n    return `Hi, I'm ${this.name} and I'm ${this.age} years old`;\n  }\n};\n\nconsole.log(person.greet());", difficulty: "beginner", category: "fundamentals", order: 14, isCompleted: false },
    { id: "15", title: "ES6 Arrow Functions", description: "Modern function syntax and features", content: "Arrow functions provide a concise syntax:\n\nTraditional: function(x) { return x * 2; }\nArrow: (x) => x * 2\n\nKey differences:\n• Shorter syntax\n• No own 'this' binding\n• Great for callbacks", codeExample: "// Traditional\nfunction double(x) { return x * 2; }\n\n// Arrow function\nconst doubleArrow = (x) => x * 2;\n\n// With arrays\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);", difficulty: "intermediate", category: "es6", order: 15, isCompleted: false },
    { id: "16", title: "Destructuring", description: "Extracting values from arrays and objects", content: "Destructuring extracts values concisely:\n\nArray destructuring:\nconst [a, b] = [1, 2];\n\nObject destructuring:\nconst { name, age } = person;", codeExample: "// Array destructuring\nconst [first, second, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(first, second, rest);\n\n// Object destructuring\nconst { name, age, city = 'Unknown' } = { name: 'Alice', age: 25 };\nconsole.log(name, age, city);", difficulty: "intermediate", category: "es6", order: 16, isCompleted: false },
    { id: "17", title: "Spread and Rest Operators", description: "Working with ... operator in JavaScript", content: "The spread operator (...) expands items.\nThe rest parameter (...) collects items.\n\nUses:\n• Combine arrays\n• Copy objects\n• Flexible function parameters", codeExample: "// Spread\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconst combined = [...arr1, ...arr2];\nconsole.log(combined);\n\n// Rest\nfunction sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}\nconsole.log(sum(1, 2, 3, 4, 5));", difficulty: "intermediate", category: "es6", order: 17, isCompleted: false },
    { id: "18", title: "Promises and Async/Await", description: "Handling asynchronous operations in JavaScript", content: "Promises handle async operations:\n• pending - initial state\n• fulfilled - success\n• rejected - failure\n\nasync/await makes promises easier to read.", codeExample: "// Promise\nfunction fetchData() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve('Data loaded!'), 1000);\n  });\n}\n\n// async/await\nasync function loadData() {\n  const data = await fetchData();\n  console.log(data);\n}\n\nloadData();", difficulty: "intermediate", category: "async", order: 18, isCompleted: false },
    { id: "19", title: "Error Handling", description: "Using try/catch to handle errors gracefully", content: "Error handling prevents crashes:\n• try - code that might fail\n• catch - handle the error\n• finally - always runs\n• throw - create errors", codeExample: "async function fetchUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    if (!response.ok) throw new Error('User not found');\n    return await response.json();\n  } catch (error) {\n    console.error('Error:', error.message);\n    return null;\n  } finally {\n    console.log('Request completed');\n  }\n}", difficulty: "intermediate", category: "error-handling", order: 19, isCompleted: false },
    { id: "20", title: "Classes and OOP", description: "Object-oriented programming with ES6 classes", content: "Classes provide a clean OOP syntax:\n• constructor - initialize objects\n• methods - define behavior\n• extends - inheritance\n• super - call parent", codeExample: "class Animal {\n  constructor(name, sound) {\n    this.name = name;\n    this.sound = sound;\n  }\n  speak() {\n    return `${this.name} says ${this.sound}`;\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name) {\n    super(name, 'woof');\n  }\n  fetch() { return `${this.name} fetches the ball!`; }\n}\n\nconst dog = new Dog('Rex');\nconsole.log(dog.speak());\nconsole.log(dog.fetch());", difficulty: "intermediate", category: "oop", order: 20, isCompleted: false },
  ]).onConflictDoNothing();

  await db.insert(challenges).values([
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
      solution: "function findSecondLargest(arr) {\n  let first = arr[0], second = -1;\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > first) { second = first; first = arr[i]; }\n    else if (arr[i] > second && arr[i] < first) { second = arr[i]; }\n  }\n  return second;\n}",
      hints: ["Think about tracking two variables", "Don't sort the array"],
    },
    {
      id: "2",
      title: "String Reversal",
      description: "Reverse a string without using the built-in reverse method",
      difficulty: "easy",
      category: "strings",
      testCases: [
        { input: "hello", expected: "olleh" },
        { input: "JavaScript", expected: "tpircSavaJ" },
      ],
      solution: "function reverseString(str) {\n  let result = '';\n  for (let i = str.length - 1; i >= 0; i--) {\n    result += str[i];\n  }\n  return result;\n}",
      hints: ["Loop backwards through the string", "Build a new string character by character"],
    },
    {
      id: "3",
      title: "FizzBuzz",
      description: "Print numbers 1-100 with Fizz for multiples of 3, Buzz for 5, FizzBuzz for both",
      difficulty: "easy",
      category: "logic",
      testCases: [
        { input: 15, expected: "FizzBuzz" },
        { input: 9, expected: "Fizz" },
        { input: 10, expected: "Buzz" },
      ],
      solution: "function fizzBuzz(n) {\n  if (n % 15 === 0) return 'FizzBuzz';\n  if (n % 3 === 0) return 'Fizz';\n  if (n % 5 === 0) return 'Buzz';\n  return String(n);\n}",
      hints: ["Check divisibility by 15 first", "Use the modulo operator %"],
    },
  ]).onConflictDoNothing();

  await db.insert(communityPosts).values([
    { id: "1", userId: "sample-user", title: "Can someone explain the difference between let and const?", content: "I'm having trouble understanding when to use let vs const in JavaScript.", category: "questions", likes: 5, replies: 3 },
    { id: "2", userId: "sample-user-2", title: "Just completed my first JavaScript project!", content: "Thanks to the AI tutor for the helpful explanations.", category: "achievements", likes: 12, replies: 1 },
  ]).onConflictDoNothing();

  console.log("✅ Database seeded successfully");
}
