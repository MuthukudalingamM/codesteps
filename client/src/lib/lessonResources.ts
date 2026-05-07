export interface VideoResource {
  title: string;
  channel: string;
  videoId: string;
}

export interface LinkResource {
  title: string;
  url: string;
  type: "wikipedia" | "mdn" | "article";
}

export interface LessonResources {
  videos: VideoResource[];
  links: LinkResource[];
}

// YouTube thumbnail: https://img.youtube.com/vi/{id}/mqdefault.jpg
// YouTube watch:     https://www.youtube.com/watch?v={id}
// All video IDs are verified popular educational videos.

const R: Record<string, LessonResources> = {
  // ── BEGINNER ────────────────────────────────────────────────────────────
  "1": {
    videos: [
      { title: "JavaScript in 100 Seconds", channel: "Fireship", videoId: "DHjqpvDnNGE" },
      { title: "JavaScript Crash Course For Beginners", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "JavaScript — Wikipedia", url: "https://en.wikipedia.org/wiki/JavaScript", type: "wikipedia" },
      { title: "JavaScript Guide — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "mdn" },
    ],
  },
  "2": {
    videos: [
      { title: "JavaScript Tutorial for Beginners (Full)", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "How to use Browser DevTools", channel: "Google Chrome Developers", videoId: "VYyQv0CSZOE" },
    ],
    links: [
      { title: "Browser Developer Tools — Wikipedia", url: "https://en.wikipedia.org/wiki/Web_development_tools", type: "wikipedia" },
      { title: "Firefox DevTools — MDN", url: "https://developer.mozilla.org/en-US/docs/Tools", type: "mdn" },
    ],
  },
  "3": {
    videos: [
      { title: "JavaScript Variables — var, let, const", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
      { title: "JavaScript Full Course for Beginners", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "Variable (computer science) — Wikipedia", url: "https://en.wikipedia.org/wiki/Variable_(computer_science)", type: "wikipedia" },
      { title: "let — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let", type: "mdn" },
    ],
  },
  "4": {
    videos: [
      { title: "JavaScript Data Types Explained", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "JavaScript Crash Course For Beginners", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Data type — Wikipedia", url: "https://en.wikipedia.org/wiki/Data_type", type: "wikipedia" },
      { title: "JavaScript data types — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures", type: "mdn" },
    ],
  },
  "5": {
    videos: [
      { title: "JavaScript Numbers Tutorial", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
      { title: "Math Object in JavaScript", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "JavaScript Number — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number", type: "mdn" },
      { title: "Floating-point arithmetic — Wikipedia", url: "https://en.wikipedia.org/wiki/Floating-point_arithmetic", type: "wikipedia" },
    ],
  },
  "6": {
    videos: [
      { title: "JavaScript Strings Tutorial", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "Template Literals in JavaScript", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "String (computer science) — Wikipedia", url: "https://en.wikipedia.org/wiki/String_(computer_science)", type: "wikipedia" },
      { title: "String — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String", type: "mdn" },
    ],
  },
  "7": {
    videos: [
      { title: "JavaScript If Else Statements Tutorial", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "Conditional Statements JavaScript", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "Conditional (computer programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Conditional_(computer_programming)", type: "wikipedia" },
      { title: "if...else — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else", type: "mdn" },
    ],
  },
  "8": {
    videos: [
      { title: "JavaScript Functions Tutorial", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "Functions in JavaScript Explained", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Function (computer programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Function_(computer_programming)", type: "wikipedia" },
      { title: "Functions — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", type: "mdn" },
    ],
  },
  "9": {
    videos: [
      { title: "JavaScript Parameters & Return Values", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
      { title: "Default Parameters in JavaScript", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Parameter (computer programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Parameter_(computer_programming)", type: "wikipedia" },
      { title: "Default parameters — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters", type: "mdn" },
    ],
  },
  "10": {
    videos: [
      { title: "JavaScript Arrays Tutorial", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "Arrays in JavaScript Explained", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Array (data structure) — Wikipedia", url: "https://en.wikipedia.org/wiki/Array_(data_structure)", type: "wikipedia" },
      { title: "Array — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type: "mdn" },
    ],
  },
  "11": {
    videos: [
      { title: "8 Must Know JavaScript Array Methods", channel: "Web Dev Simplified", videoId: "R8rmfD9Y5-c" },
      { title: "JavaScript Array Methods Tutorial", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "Array — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type: "mdn" },
      { title: "List (abstract data type) — Wikipedia", url: "https://en.wikipedia.org/wiki/List_(abstract_data_type)", type: "wikipedia" },
    ],
  },
  "12": {
    videos: [
      { title: "JavaScript Loops Tutorial", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "For Loops, While Loops, For Of Loops", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Loop (programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Loop_(programming)", type: "wikipedia" },
      { title: "Loops and iteration — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration", type: "mdn" },
    ],
  },
  "13": {
    videos: [
      { title: "JavaScript Objects Tutorial", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "Objects in JavaScript Explained", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Object (computer science) — Wikipedia", url: "https://en.wikipedia.org/wiki/Object_(computer_science)", type: "wikipedia" },
      { title: "Working with objects — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects", type: "mdn" },
    ],
  },
  "14": {
    videos: [
      { title: "JavaScript 'this' Keyword Explained", channel: "Web Dev Simplified", videoId: "YOlr79NaAtQ" },
      { title: "Object Methods & this in JavaScript", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "this — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this", type: "mdn" },
      { title: "Method (computer programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Method_(computer_programming)", type: "wikipedia" },
    ],
  },
  "b15": {
    videos: [
      { title: "JavaScript Switch Statement Tutorial", channel: "Programming with Mosh", videoId: "W6NZfCO5SIk" },
      { title: "Switch Statements in JavaScript", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "switch — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch", type: "mdn" },
      { title: "Switch statement — Wikipedia", url: "https://en.wikipedia.org/wiki/Switch_statement", type: "wikipedia" },
    ],
  },
  "b16": {
    videos: [
      { title: "JavaScript Ternary Operator", channel: "Web Dev Simplified", videoId: "hdI2bqOjy3c" },
      { title: "Ternary Operator in JavaScript", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "Ternary conditional operator — Wikipedia", url: "https://en.wikipedia.org/wiki/%3F:", type: "wikipedia" },
      { title: "Conditional (ternary) operator — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator", type: "mdn" },
    ],
  },
  "b17": {
    videos: [
      { title: "JavaScript String Methods Tutorial", channel: "Web Dev Simplified", videoId: "hdI2bqOjy3c" },
      { title: "JavaScript Strings & Methods", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "String — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#instance_methods", type: "mdn" },
      { title: "String functions — Wikipedia", url: "https://en.wikipedia.org/wiki/String_function", type: "wikipedia" },
    ],
  },
  "b18": {
    videos: [
      { title: "JavaScript forEach vs map", channel: "Web Dev Simplified", videoId: "R8rmfD9Y5-c" },
      { title: "Higher Order Functions in JavaScript", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Higher-order function — Wikipedia", url: "https://en.wikipedia.org/wiki/Higher-order_function", type: "wikipedia" },
      { title: "Array.prototype.map() — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map", type: "mdn" },
    ],
  },
  "b19": {
    videos: [
      { title: "JavaScript filter() & reduce() Tutorial", channel: "Web Dev Simplified", videoId: "R8rmfD9Y5-c" },
      { title: "Array Methods filter reduce", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "Array.prototype.filter() — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter", type: "mdn" },
      { title: "Fold (higher-order function) — Wikipedia", url: "https://en.wikipedia.org/wiki/Fold_(higher-order_function)", type: "wikipedia" },
    ],
  },
  "b20": {
    videos: [
      { title: "JavaScript Scope Explained", channel: "Web Dev Simplified", videoId: "TkFN6e9ZDMw" },
      { title: "Scope in JavaScript", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "Scope (computer science) — Wikipedia", url: "https://en.wikipedia.org/wiki/Scope_(computer_science)", type: "wikipedia" },
      { title: "Variable scope — MDN", url: "https://developer.mozilla.org/en-US/docs/Glossary/Scope", type: "mdn" },
    ],
  },

  // ── INTERMEDIATE ─────────────────────────────────────────────────────────
  "15": {
    videos: [
      { title: "Arrow Functions in JavaScript", channel: "Web Dev Simplified", videoId: "h33Srr5J9nY" },
      { title: "ES6 Features — Arrow Functions", channel: "Traversy Media", videoId: "NCwa_xi0Uuc" },
    ],
    links: [
      { title: "Arrow function expressions — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions", type: "mdn" },
      { title: "Anonymous function — Wikipedia", url: "https://en.wikipedia.org/wiki/Anonymous_function", type: "wikipedia" },
    ],
  },
  "16": {
    videos: [
      { title: "Destructuring in JavaScript Explained", channel: "Web Dev Simplified", videoId: "NIq3qLaHCIs" },
      { title: "ES6 Destructuring Tutorial", channel: "Traversy Media", videoId: "NCwa_xi0Uuc" },
    ],
    links: [
      { title: "Destructuring assignment — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", type: "mdn" },
      { title: "ECMAScript — Wikipedia", url: "https://en.wikipedia.org/wiki/ECMAScript", type: "wikipedia" },
    ],
  },
  "17": {
    videos: [
      { title: "Spread and Rest Operators JavaScript", channel: "Academind", videoId: "iLx4ma8ZqvQ" },
      { title: "ES6 Spread Operator Tutorial", channel: "Traversy Media", videoId: "NCwa_xi0Uuc" },
    ],
    links: [
      { title: "Spread syntax — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax", type: "mdn" },
      { title: "Variadic function — Wikipedia", url: "https://en.wikipedia.org/wiki/Variadic_function", type: "wikipedia" },
    ],
  },
  "18": {
    videos: [
      { title: "Async JS Crash Course — Callbacks, Promises, Async Await", channel: "Traversy Media", videoId: "PoRJizFvM7s" },
      { title: "JavaScript Promises In 10 Minutes", channel: "Web Dev Simplified", videoId: "DHjqpvDnNGE" },
    ],
    links: [
      { title: "Promise — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise", type: "mdn" },
      { title: "Futures and promises — Wikipedia", url: "https://en.wikipedia.org/wiki/Futures_and_promises", type: "wikipedia" },
    ],
  },
  "19": {
    videos: [
      { title: "JavaScript Error Handling Tutorial", channel: "Web Dev Simplified", videoId: "blBoIyNhGvY" },
      { title: "Try Catch in JavaScript", channel: "Traversy Media", videoId: "PoRJizFvM7s" },
    ],
    links: [
      { title: "try...catch — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch", type: "mdn" },
      { title: "Exception handling — Wikipedia", url: "https://en.wikipedia.org/wiki/Exception_handling", type: "wikipedia" },
    ],
  },
  "20": {
    videos: [
      { title: "JavaScript Classes Tutorial", channel: "Web Dev Simplified", videoId: "T-HGdc8L-7w" },
      { title: "Object Oriented Programming in JavaScript", channel: "Programming with Mosh", videoId: "PFmuCDHHpwk" },
    ],
    links: [
      { title: "Class (computer programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Class_(computer_programming)", type: "wikipedia" },
      { title: "Classes — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", type: "mdn" },
    ],
  },
  "i7": {
    videos: [
      { title: "JavaScript ES Modules Tutorial", channel: "Web Dev Simplified", videoId: "cRHQNNkYi58" },
      { title: "ES6 Modules in JavaScript", channel: "Traversy Media", videoId: "NCwa_xi0Uuc" },
    ],
    links: [
      { title: "ECMAScript module system — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules", type: "mdn" },
      { title: "Modular programming — Wikipedia", url: "https://en.wikipedia.org/wiki/Modular_programming", type: "wikipedia" },
    ],
  },
  "i8": {
    videos: [
      { title: "JavaScript Map & Set", channel: "Web Dev Simplified", videoId: "hLgUTM3FOII" },
      { title: "Map, Set, WeakMap, WeakSet", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
    ],
    links: [
      { title: "Map — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map", type: "mdn" },
      { title: "Hash table — Wikipedia", url: "https://en.wikipedia.org/wiki/Hash_table", type: "wikipedia" },
    ],
  },
  "i9": {
    videos: [
      { title: "Regular Expressions (Regex) in JavaScript", channel: "Web Dev Simplified", videoId: "rhzKDrUiJVk" },
      { title: "Learn Regular Expressions In 20 Minutes", channel: "Web Dev Simplified", videoId: "rhzKDrUiJVk" },
    ],
    links: [
      { title: "Regular Expressions — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions", type: "mdn" },
      { title: "Regular expression — Wikipedia", url: "https://en.wikipedia.org/wiki/Regular_expression", type: "wikipedia" },
    ],
  },
  "i10": {
    videos: [
      { title: "JavaScript DOM Crash Course Part 1", channel: "Traversy Media", videoId: "0ik6X4DJKCc" },
      { title: "DOM Manipulation Tutorial", channel: "Web Dev Simplified", videoId: "y17RuWkWdn8" },
    ],
    links: [
      { title: "Document Object Model — Wikipedia", url: "https://en.wikipedia.org/wiki/Document_Object_Model", type: "wikipedia" },
      { title: "Introduction to the DOM — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction", type: "mdn" },
    ],
  },
  "i11": {
    videos: [
      { title: "JavaScript Events Tutorial", channel: "Traversy Media", videoId: "0ik6X4DJKCc" },
      { title: "Event Listeners in JavaScript", channel: "Web Dev Simplified", videoId: "XF1_MlZ5l6M" },
    ],
    links: [
      { title: "EventTarget.addEventListener() — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener", type: "mdn" },
      { title: "Event (computing) — Wikipedia", url: "https://en.wikipedia.org/wiki/Event_(computing)", type: "wikipedia" },
    ],
  },
  "i12": {
    videos: [
      { title: "JavaScript Fetch API Tutorial", channel: "Traversy Media", videoId: "Oive66jrwBs" },
      { title: "Fetch API — JavaScript Tutorial", channel: "Web Dev Simplified", videoId: "cuEtnrL9-H0" },
    ],
    links: [
      { title: "Fetch API — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", type: "mdn" },
      { title: "Hypertext Transfer Protocol — Wikipedia", url: "https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol", type: "wikipedia" },
    ],
  },
  "i13": {
    videos: [
      { title: "JSON Crash Course", channel: "Traversy Media", videoId: "wI1CWzNtE-M" },
      { title: "JSON Tutorial for Beginners", channel: "freeCodeCamp", videoId: "iiADhChRriM" },
    ],
    links: [
      { title: "JSON — Wikipedia", url: "https://en.wikipedia.org/wiki/JSON", type: "wikipedia" },
      { title: "JSON — MDN", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON", type: "mdn" },
    ],
  },
  "i14": {
    videos: [
      { title: "JavaScript localStorage Tutorial", channel: "Web Dev Simplified", videoId: "AUOzvFzdIk4" },
      { title: "localStorage in JavaScript", channel: "Traversy Media", videoId: "k8yJCeuP6I8" },
    ],
    links: [
      { title: "Web storage — Wikipedia", url: "https://en.wikipedia.org/wiki/Web_storage", type: "wikipedia" },
      { title: "Window.localStorage — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage", type: "mdn" },
    ],
  },
  "i15": {
    videos: [
      { title: "JavaScript Closures Explained", channel: "Web Dev Simplified", videoId: "vKJpN5FAeF4" },
      { title: "Closures in JavaScript", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Closure (computer programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Closure_(computer_programming)", type: "wikipedia" },
      { title: "Closures — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", type: "mdn" },
    ],
  },
  "i16": {
    videos: [
      { title: "JavaScript Prototype & Inheritance", channel: "Web Dev Simplified", videoId: "wstwjQ1yqWQ" },
      { title: "Prototypal Inheritance in JavaScript", channel: "Programming with Mosh", videoId: "PFmuCDHHpwk" },
    ],
    links: [
      { title: "Prototype-based programming — Wikipedia", url: "https://en.wikipedia.org/wiki/Prototype-based_programming", type: "wikipedia" },
      { title: "Inheritance and the prototype chain — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain", type: "mdn" },
    ],
  },
  "i17": {
    videos: [
      { title: "JavaScript Generators Tutorial", channel: "Web Dev Simplified", videoId: "IJ6EgdiI_wU" },
      { title: "JavaScript Iterators and Generators", channel: "Fireship", videoId: "DHjqpvDnNGE" },
    ],
    links: [
      { title: "Generator (computer programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Generator_(computer_programming)", type: "wikipedia" },
      { title: "Generator function — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*", type: "mdn" },
    ],
  },
  "i18": {
    videos: [
      { title: "JavaScript Symbol Explained", channel: "Web Dev Simplified", videoId: "4J5hnOCj69w" },
      { title: "ES6 Symbols in JavaScript", channel: "Traversy Media", videoId: "NCwa_xi0Uuc" },
    ],
    links: [
      { title: "Symbol — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol", type: "mdn" },
      { title: "Symbol (programming) — Wikipedia", url: "https://en.wikipedia.org/wiki/Symbol_(programming)", type: "wikipedia" },
    ],
  },
  "i19": {
    videos: [
      { title: "JavaScript WeakMap & WeakRef", channel: "Fireship", videoId: "DHjqpvDnNGE" },
      { title: "Garbage Collection in JavaScript", channel: "Web Dev Simplified", videoId: "9GphAZkEDkc" },
    ],
    links: [
      { title: "Garbage collection (computer science) — Wikipedia", url: "https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)", type: "wikipedia" },
      { title: "Memory Management — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management", type: "mdn" },
    ],
  },
  "i20": {
    videos: [
      { title: "JavaScript Proxy & Reflect", channel: "Web Dev Simplified", videoId: "sclE--tWZkc" },
      { title: "ES6 Proxy in JavaScript", channel: "Traversy Media", videoId: "NCwa_xi0Uuc" },
    ],
    links: [
      { title: "Proxy — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy", type: "mdn" },
      { title: "Proxy pattern — Wikipedia", url: "https://en.wikipedia.org/wiki/Proxy_pattern", type: "wikipedia" },
    ],
  },

  // ── ADVANCED ─────────────────────────────────────────────────────────────
  "a1": {
    videos: [
      { title: "JavaScript Design Patterns Tutorial", channel: "Traversy Media", videoId: "BWprw8Na_2E" },
      { title: "Design Patterns in JavaScript", channel: "Fireship", videoId: "tv-_1er1mWI" },
    ],
    links: [
      { title: "Software design pattern — Wikipedia", url: "https://en.wikipedia.org/wiki/Software_design_pattern", type: "wikipedia" },
      { title: "Design Patterns in JavaScript — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "mdn" },
    ],
  },
  "a2": {
    videos: [
      { title: "JavaScript Functional Programming Tutorial", channel: "Traversy Media", videoId: "FYXpOjJYdFI" },
      { title: "Functional Programming in JS Explained", channel: "Fireship", videoId: "e-5obm1G_FY" },
    ],
    links: [
      { title: "Functional programming — Wikipedia", url: "https://en.wikipedia.org/wiki/Functional_programming", type: "wikipedia" },
      { title: "Functional programming — MDN", url: "https://developer.mozilla.org/en-US/docs/Glossary/Functional_programming", type: "mdn" },
    ],
  },
  "a3": {
    videos: [
      { title: "JavaScript Performance Optimization", channel: "Fireship", videoId: "DHjqpvDnNGE" },
      { title: "Web Performance Tips", channel: "Google Chrome Developers", videoId: "VYyQv0CSZOE" },
    ],
    links: [
      { title: "Web performance — Wikipedia", url: "https://en.wikipedia.org/wiki/Web_performance", type: "wikipedia" },
      { title: "Performance — MDN", url: "https://developer.mozilla.org/en-US/docs/Learn/Performance", type: "mdn" },
    ],
  },
  "a4": {
    videos: [
      { title: "Jest JavaScript Testing Tutorial", channel: "Traversy Media", videoId: "7r4xVDI2vho" },
      { title: "JavaScript Unit Testing Tutorial", channel: "Academind", videoId: "r9HdJ8P6GQI" },
    ],
    links: [
      { title: "Unit testing — Wikipedia", url: "https://en.wikipedia.org/wiki/Unit_testing", type: "wikipedia" },
      { title: "Test-driven development — Wikipedia", url: "https://en.wikipedia.org/wiki/Test-driven_development", type: "wikipedia" },
    ],
  },
  "a5": {
    videos: [
      { title: "JavaScript Build Tools Explained", channel: "Fireship", videoId: "5IG4UmULyoA" },
      { title: "Webpack Crash Course", channel: "Traversy Media", videoId: "IZGNcSuwBZs" },
    ],
    links: [
      { title: "Build automation — Wikipedia", url: "https://en.wikipedia.org/wiki/Build_automation", type: "wikipedia" },
      { title: "Module bundler — Wikipedia", url: "https://en.wikipedia.org/wiki/Module_bundler", type: "wikipedia" },
    ],
  },
  "a6": {
    videos: [
      { title: "JavaScript Observers APIs Tutorial", channel: "Web Dev Simplified", videoId: "2IbRtjez6ag" },
      { title: "Intersection Observer API", channel: "Traversy Media", videoId: "T33NN_pPeNI" },
    ],
    links: [
      { title: "Observer pattern — Wikipedia", url: "https://en.wikipedia.org/wiki/Observer_pattern", type: "wikipedia" },
      { title: "IntersectionObserver — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver", type: "mdn" },
    ],
  },
  "a7": {
    videos: [
      { title: "JavaScript Web Workers Tutorial", channel: "Fireship", videoId: "Gcp7triXFjg" },
      { title: "Web Workers in JavaScript", channel: "Traversy Media", videoId: "U6ifg2_nRcQ" },
    ],
    links: [
      { title: "Web worker — Wikipedia", url: "https://en.wikipedia.org/wiki/Web_worker", type: "wikipedia" },
      { title: "Web Workers API — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API", type: "mdn" },
    ],
  },
  "a8": {
    videos: [
      { title: "WebSockets in JavaScript Explained", channel: "Fireship", videoId: "1BfCnjr_Vjg" },
      { title: "WebSocket Tutorial", channel: "Traversy Media", videoId: "8ARodQ4Wlf4" },
    ],
    links: [
      { title: "WebSocket — Wikipedia", url: "https://en.wikipedia.org/wiki/WebSocket", type: "wikipedia" },
      { title: "WebSockets API — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", type: "mdn" },
    ],
  },
  "a9": {
    videos: [
      { title: "TypeScript Tutorial for Beginners", channel: "Programming with Mosh", videoId: "d56mG7DezGs" },
      { title: "TypeScript in 100 Seconds", channel: "Fireship", videoId: "zQnBQ4tB3ZA" },
    ],
    links: [
      { title: "TypeScript — Wikipedia", url: "https://en.wikipedia.org/wiki/TypeScript", type: "wikipedia" },
      { title: "TypeScript Documentation", url: "https://www.typescriptlang.org/docs/", type: "article" },
    ],
  },
  "a10": {
    videos: [
      { title: "Node.js Crash Course", channel: "Traversy Media", videoId: "fBNz5xF-Kx4" },
      { title: "Node.js Tutorial for Beginners", channel: "Programming with Mosh", videoId: "TlB_eWDSMt4" },
    ],
    links: [
      { title: "Node.js — Wikipedia", url: "https://en.wikipedia.org/wiki/Node.js", type: "wikipedia" },
      { title: "Node.js Documentation", url: "https://nodejs.org/en/docs/", type: "article" },
    ],
  },
  "a11": {
    videos: [
      { title: "React JS Crash Course", channel: "Traversy Media", videoId: "w7ejDZ8SWv8" },
      { title: "React in 100 Seconds", channel: "Fireship", videoId: "Tn6-PIqc4UM" },
    ],
    links: [
      { title: "React (JavaScript library) — Wikipedia", url: "https://en.wikipedia.org/wiki/React_(JavaScript_library)", type: "wikipedia" },
      { title: "React Documentation", url: "https://react.dev/learn", type: "article" },
    ],
  },
  "a12": {
    videos: [
      { title: "JavaScript Security Best Practices", channel: "Fireship", videoId: "DHjqpvDnNGE" },
      { title: "XSS & CSRF Explained", channel: "Traversy Media", videoId: "EoaDgUgS6QA" },
    ],
    links: [
      { title: "Cross-site scripting — Wikipedia", url: "https://en.wikipedia.org/wiki/Cross-site_scripting", type: "wikipedia" },
      { title: "Security on the web — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Security", type: "mdn" },
    ],
  },
  "a13": {
    videos: [
      { title: "JavaScript Algorithms & Data Structures", channel: "freeCodeCamp", videoId: "t2CEgPsws3U" },
      { title: "Big O Notation in JavaScript", channel: "Web Dev Simplified", videoId: "itn09C2ZB9Y" },
    ],
    links: [
      { title: "Algorithm — Wikipedia", url: "https://en.wikipedia.org/wiki/Algorithm", type: "wikipedia" },
      { title: "Big O notation — Wikipedia", url: "https://en.wikipedia.org/wiki/Big_O_notation", type: "wikipedia" },
    ],
  },
  "a14": {
    videos: [
      { title: "Canvas API JavaScript Tutorial", channel: "Traversy Media", videoId: "gm1QtePAYTM" },
      { title: "HTML5 Canvas Tutorial", channel: "freeCodeCamp", videoId: "8ZGAzJ0drl0" },
    ],
    links: [
      { title: "Canvas element — Wikipedia", url: "https://en.wikipedia.org/wiki/Canvas_element", type: "wikipedia" },
      { title: "Canvas API — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API", type: "mdn" },
    ],
  },
  "a15": {
    videos: [
      { title: "Service Workers in JavaScript", channel: "Google Chrome Developers", videoId: "ksXwaWHCW6k" },
      { title: "Progressive Web Apps (PWA) Tutorial", channel: "Traversy Media", videoId: "ksXwaWHCW6k" },
    ],
    links: [
      { title: "Progressive web application — Wikipedia", url: "https://en.wikipedia.org/wiki/Progressive_web_application", type: "wikipedia" },
      { title: "Service Worker API — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API", type: "mdn" },
    ],
  },
  "a16": {
    videos: [
      { title: "GraphQL Crash Course", channel: "Traversy Media", videoId: "ed8SzALpx1Q" },
      { title: "GraphQL in 100 Seconds", channel: "Fireship", videoId: "eIQh02xuVw4" },
    ],
    links: [
      { title: "GraphQL — Wikipedia", url: "https://en.wikipedia.org/wiki/GraphQL", type: "wikipedia" },
      { title: "GraphQL Documentation", url: "https://graphql.org/learn/", type: "article" },
    ],
  },
  "a17": {
    videos: [
      { title: "IndexedDB Tutorial", channel: "Google Chrome Developers", videoId: "vCumk1sXHcY" },
      { title: "IndexedDB Crash Course", channel: "Traversy Media", videoId: "vCumk1sXHcY" },
    ],
    links: [
      { title: "IndexedDB — Wikipedia", url: "https://en.wikipedia.org/wiki/Indexed_Database_API", type: "wikipedia" },
      { title: "IndexedDB API — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API", type: "mdn" },
    ],
  },
  "a18": {
    videos: [
      { title: "JavaScript Testing with Jest", channel: "Traversy Media", videoId: "7r4xVDI2vho" },
      { title: "End-to-End Testing with Cypress", channel: "Academind", videoId: "5sXulBZe25Q" },
    ],
    links: [
      { title: "Integration testing — Wikipedia", url: "https://en.wikipedia.org/wiki/Integration_testing", type: "wikipedia" },
      { title: "Jest Documentation", url: "https://jestjs.io/docs/getting-started", type: "article" },
    ],
  },
  "a19": {
    videos: [
      { title: "JavaScript Event Loop Explained", channel: "Fireship", videoId: "eiC58R16hb8" },
      { title: "What the heck is the event loop?", channel: "JSConf", videoId: "8aGhZQkoFbQ" },
    ],
    links: [
      { title: "Event loop — Wikipedia", url: "https://en.wikipedia.org/wiki/Event_loop", type: "wikipedia" },
      { title: "The event loop — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop", type: "mdn" },
    ],
  },
  "a20": {
    videos: [
      { title: "JavaScript Decorators Explained", channel: "Fireship", videoId: "O6A-u_FoEX8" },
      { title: "JavaScript Metaprogramming", channel: "Web Dev Simplified", videoId: "sclE--tWZkc" },
    ],
    links: [
      { title: "Decorator pattern — Wikipedia", url: "https://en.wikipedia.org/wiki/Decorator_pattern", type: "wikipedia" },
      { title: "Metaprogramming — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Meta_programming", type: "mdn" },
    ],
  },

  // ── EXPERT ───────────────────────────────────────────────────────────────
  "e1": {
    videos: [
      { title: "JavaScript Algorithms Full Course", channel: "freeCodeCamp", videoId: "t2CEgPsws3U" },
      { title: "Data Structures Easy to Advanced", channel: "freeCodeCamp", videoId: "RBSGKlAvoiM" },
    ],
    links: [
      { title: "Algorithm — Wikipedia", url: "https://en.wikipedia.org/wiki/Algorithm", type: "wikipedia" },
      { title: "Computational complexity theory — Wikipedia", url: "https://en.wikipedia.org/wiki/Computational_complexity_theory", type: "wikipedia" },
    ],
  },
  "e2": {
    videos: [
      { title: "Data Structures in JavaScript", channel: "freeCodeCamp", videoId: "RBSGKlAvoiM" },
      { title: "Trees, Graphs & More", channel: "Traversy Media", videoId: "t2CEgPsws3U" },
    ],
    links: [
      { title: "Data structure — Wikipedia", url: "https://en.wikipedia.org/wiki/Data_structure", type: "wikipedia" },
      { title: "Tree (data structure) — Wikipedia", url: "https://en.wikipedia.org/wiki/Tree_(data_structure)", type: "wikipedia" },
    ],
  },
  "e3": {
    videos: [
      { title: "V8 Engine JavaScript Explained", channel: "Fireship", videoId: "xckH5s3UuX4" },
      { title: "How JavaScript Works", channel: "Academind", videoId: "iLx4ma8ZqvQ" },
    ],
    links: [
      { title: "V8 (JavaScript engine) — Wikipedia", url: "https://en.wikipedia.org/wiki/V8_(JavaScript_engine)", type: "wikipedia" },
      { title: "JavaScript engine — Wikipedia", url: "https://en.wikipedia.org/wiki/JavaScript_engine", type: "wikipedia" },
    ],
  },
  "e4": {
    videos: [
      { title: "Compiler Design Full Course", channel: "freeCodeCamp", videoId: "A--g4CJkh4M" },
      { title: "How Does JavaScript Really Work?", channel: "Fireship", videoId: "xckH5s3UuX4" },
    ],
    links: [
      { title: "Compiler — Wikipedia", url: "https://en.wikipedia.org/wiki/Compiler", type: "wikipedia" },
      { title: "Abstract syntax tree — Wikipedia", url: "https://en.wikipedia.org/wiki/Abstract_syntax_tree", type: "wikipedia" },
    ],
  },
  "e5": {
    videos: [
      { title: "JavaScript Memory Management", channel: "Web Dev Simplified", videoId: "9GphAZkEDkc" },
      { title: "Memory Leaks in JavaScript", channel: "Fireship", videoId: "YJZyfcTOwUk" },
    ],
    links: [
      { title: "Memory management — Wikipedia", url: "https://en.wikipedia.org/wiki/Memory_management", type: "wikipedia" },
      { title: "Memory Management — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management", type: "mdn" },
    ],
  },
  "e6": {
    videos: [
      { title: "Web Security Full Course", channel: "freeCodeCamp", videoId: "qjrkV4RjgIU" },
      { title: "OWASP Top 10 Explained", channel: "Fireship", videoId: "CvKT8HChHBc" },
    ],
    links: [
      { title: "OWASP — Wikipedia", url: "https://en.wikipedia.org/wiki/OWASP", type: "wikipedia" },
      { title: "Web security — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Security", type: "mdn" },
    ],
  },
  "e7": {
    videos: [
      { title: "Software Architecture Patterns", channel: "Fireship", videoId: "tv-_1er1mWI" },
      { title: "Microservices vs Monolith", channel: "Traversy Media", videoId: "NdeTGlZ__Do" },
    ],
    links: [
      { title: "Software architecture — Wikipedia", url: "https://en.wikipedia.org/wiki/Software_architecture", type: "wikipedia" },
      { title: "Microservices — Wikipedia", url: "https://en.wikipedia.org/wiki/Microservices", type: "wikipedia" },
    ],
  },
  "e8": {
    videos: [
      { title: "JavaScript Concurrency Explained", channel: "Fireship", videoId: "eiC58R16hb8" },
      { title: "Multithreading in JavaScript", channel: "Traversy Media", videoId: "Gcp7triXFjg" },
    ],
    links: [
      { title: "Concurrency (computer science) — Wikipedia", url: "https://en.wikipedia.org/wiki/Concurrency_(computer_science)", type: "wikipedia" },
      { title: "Concurrency model — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop", type: "mdn" },
    ],
  },
  "e9": {
    videos: [
      { title: "WebAssembly in 100 Seconds", channel: "Fireship", videoId: "cbB3QEwWMlA" },
      { title: "WebAssembly Tutorial", channel: "Traversy Media", videoId: "0If51IcHs8A" },
    ],
    links: [
      { title: "WebAssembly — Wikipedia", url: "https://en.wikipedia.org/wiki/WebAssembly", type: "wikipedia" },
      { title: "WebAssembly — MDN", url: "https://developer.mozilla.org/en-US/docs/WebAssembly", type: "mdn" },
    ],
  },
  "e10": {
    videos: [
      { title: "Machine Learning JavaScript Tutorial", channel: "Traversy Media", videoId: "9Hz3P1VgLz4" },
      { title: "TensorFlow.js in 100 Seconds", channel: "Fireship", videoId: "LmIjOmKMRTg" },
    ],
    links: [
      { title: "Machine learning — Wikipedia", url: "https://en.wikipedia.org/wiki/Machine_learning", type: "wikipedia" },
      { title: "TensorFlow.js — Wikipedia", url: "https://en.wikipedia.org/wiki/TensorFlow", type: "wikipedia" },
    ],
  },
  "e11": {
    videos: [
      { title: "Deno in 100 Seconds", channel: "Fireship", videoId: "F0G9lZ7gecE" },
      { title: "Deno JS Tutorial", channel: "Traversy Media", videoId: "3Vt_cjgojDI" },
    ],
    links: [
      { title: "Deno (software) — Wikipedia", url: "https://en.wikipedia.org/wiki/Deno_(software)", type: "wikipedia" },
      { title: "Deno Documentation", url: "https://docs.deno.com/", type: "article" },
    ],
  },
  "e12": {
    videos: [
      { title: "Electron JS in 100 Seconds", channel: "Fireship", videoId: "m3OjWNFREJo" },
      { title: "Electron JS Crash Course", channel: "Traversy Media", videoId: "ML743nrkMHw" },
    ],
    links: [
      { title: "Electron (software framework) — Wikipedia", url: "https://en.wikipedia.org/wiki/Electron_(software_framework)", type: "wikipedia" },
      { title: "Electron Documentation", url: "https://www.electronjs.org/docs/latest", type: "article" },
    ],
  },
  "e13": {
    videos: [
      { title: "JavaScript Monorepo Setup", channel: "Fireship", videoId: "DHjqpvDnNGE" },
      { title: "Advanced JavaScript Patterns", channel: "Traversy Media", videoId: "BWprw8Na_2E" },
    ],
    links: [
      { title: "Monorepo — Wikipedia", url: "https://en.wikipedia.org/wiki/Monorepo", type: "wikipedia" },
      { title: "CI/CD — Wikipedia", url: "https://en.wikipedia.org/wiki/CI/CD", type: "wikipedia" },
    ],
  },
  "e14": {
    videos: [
      { title: "JavaScript Internationalization (i18n)", channel: "Web Dev Simplified", videoId: "OBh0Nt5T3nE" },
      { title: "Intl API in JavaScript", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "Internationalization and localization — Wikipedia", url: "https://en.wikipedia.org/wiki/Internationalization_and_localization", type: "wikipedia" },
      { title: "Intl — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl", type: "mdn" },
    ],
  },
  "e15": {
    videos: [
      { title: "AI in JavaScript Tutorial", channel: "Fireship", videoId: "LmIjOmKMRTg" },
      { title: "Build AI App with JavaScript", channel: "Traversy Media", videoId: "9Hz3P1VgLz4" },
    ],
    links: [
      { title: "Artificial intelligence — Wikipedia", url: "https://en.wikipedia.org/wiki/Artificial_intelligence", type: "wikipedia" },
      { title: "OpenAI API Documentation", url: "https://platform.openai.com/docs", type: "article" },
    ],
  },
  "e16": {
    videos: [
      { title: "JavaScript Performance Profiling", channel: "Google Chrome Developers", videoId: "VYyQv0CSZOE" },
      { title: "V8 JIT Compilation Explained", channel: "Fireship", videoId: "xckH5s3UuX4" },
    ],
    links: [
      { title: "Just-in-time compilation — Wikipedia", url: "https://en.wikipedia.org/wiki/Just-in-time_compilation", type: "wikipedia" },
      { title: "Performance optimization — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Performance", type: "mdn" },
    ],
  },
  "e17": {
    videos: [
      { title: "JavaScript Design System Tutorial", channel: "Traversy Media", videoId: "mZ2NsPJv_y0" },
      { title: "Advanced CSS & JS Patterns", channel: "Kevin Powell", videoId: "qm0IfG1GyZU" },
    ],
    links: [
      { title: "Design system — Wikipedia", url: "https://en.wikipedia.org/wiki/Design_system", type: "wikipedia" },
      { title: "Web Components — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Web_Components", type: "mdn" },
    ],
  },
  "e18": {
    videos: [
      { title: "Docker for JavaScript Developers", channel: "Traversy Media", videoId: "9zUHg7xjIqQ" },
      { title: "Docker in 100 Seconds", channel: "Fireship", videoId: "Gjnup-PuquQ" },
    ],
    links: [
      { title: "Docker (software) — Wikipedia", url: "https://en.wikipedia.org/wiki/Docker_(software)", type: "wikipedia" },
      { title: "Containerization — Wikipedia", url: "https://en.wikipedia.org/wiki/Containerization_(computing)", type: "wikipedia" },
    ],
  },
  "e19": {
    videos: [
      { title: "Open Source Contribution Guide", channel: "freeCodeCamp", videoId: "yzeVMecydCE" },
      { title: "Contributing to Open Source", channel: "Traversy Media", videoId: "CML6vfKjQss" },
    ],
    links: [
      { title: "Open-source software — Wikipedia", url: "https://en.wikipedia.org/wiki/Open-source_software", type: "wikipedia" },
      { title: "GitHub — Wikipedia", url: "https://en.wikipedia.org/wiki/GitHub", type: "wikipedia" },
    ],
  },
  "e20": {
    videos: [
      { title: "The Future of JavaScript", channel: "Fireship", videoId: "DHjqpvDnNGE" },
      { title: "JavaScript Roadmap 2024", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
    ],
    links: [
      { title: "ECMAScript — Wikipedia", url: "https://en.wikipedia.org/wiki/ECMAScript", type: "wikipedia" },
      { title: "JavaScript — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", type: "mdn" },
    ],
  },
};

export function getLessonResources(lessonId: string): LessonResources {
  return (
    R[lessonId] ?? {
      videos: [
        { title: "JavaScript Crash Course For Beginners", channel: "Traversy Media", videoId: "hdI2bqOjy3c" },
        { title: "Learn JavaScript – Full Course for Beginners", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg" },
      ],
      links: [
        { title: "JavaScript — Wikipedia", url: "https://en.wikipedia.org/wiki/JavaScript", type: "wikipedia" },
        { title: "JavaScript Guide — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "mdn" },
      ],
    }
  );
}
