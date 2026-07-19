import { City } from "../types";

export const CURRICULUM: Record<string, City> = {
  python: {
    id: "python",
    name: "Python Core Syllabus",
    icon: "Terminal",
    color: "#22c55e",
    category: "System Scripting & Logic",
    description: "Highly readable general-purpose automation, advanced data structures, OOP structures, and standard system libraries.",
    libraryReferences: [
      {
        name: "Pandas",
        category: "Data Analysis & Structures",
        purpose: "High-performance, easy-to-use data structures and analysis tools for processing tabular data.",
        example: "import pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.describe())",
        docUrl: "https://pandas.pydata.org"
      },
      {
        name: "NumPy",
        category: "Scientific Computing",
        purpose: "Fundamental library for scientific computing containing powerful N-dimensional array objects and mathematical tools.",
        example: "import numpy as np\narr = np.array([1, 2, 3])\nprint(arr * 2)",
        docUrl: "https://numpy.org"
      },
      {
        name: "Requests",
        category: "Network Programming",
        purpose: "Elegant and simple HTTP library for sending HTTP requests and managing API integrations.",
        example: "import requests\nresponse = requests.get('https://api.github.com')\nprint(response.json())",
        docUrl: "https://requests.readthedocs.io"
      }
    ],
    floors: [
      {
        number: 1,
        title: "Consoles & Standard Print",
        problem: "Write a command that registers and outputs the text 'Hello World' directly to the output streams.",
        starter: '# Write a print statement below\n',
        testCode: 'print("Hello World")',
        theory: "Python utilizes the global <code>print()</code> function to stream textual output to the standard output buffer console, which enables real-time diagnostic logging.",
        analogy: "Like an old-school electronic ticker tape machine, stamping out letters onto a paper slide for control room operators to inspect.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Dynamic Variable Assignments",
        problem: "Create an integer parameter named 'score' and assign it a value of 100 on its own line.",
        starter: '# Declare variable below\n',
        testCode: 'score = 100',
        theory: "Variables represent named containers binding references to objects in memory. Python is dynamically typed, meaning types are determined in real-time.",
        analogy: "Sliding a piece of paper marked with '100' inside a desk tray labeled 'score'.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Conditionals & Decision Trees",
        problem: "Given 'score = 100', write an if-else block. If score is greater than or equal to 100, set 'status' to 'passed'. Otherwise, set 'status' to 'failed'.",
        starter: 'score = 100\n# Construct your conditional branches here\n',
        testCode: 'if score >= 100: && status = "passed" && else: && status = "failed"',
        theory: "Branching controls (<code>if</code>, <code>elif</code>, <code>else</code>) run blocks of code based on Boolean expressions. Proper indentation defines scopes instead of curly brackets.",
        analogy: "A physical hydraulic railway switch. The oncoming train triggers a scale; if it clears 100 tons, the rails guide it to route 'passed'; else, to route 'failed'.",
        difficulty: "DYNAMICS"
      },
      {
        number: 4,
        title: "Iteration with For Loops",
        problem: "Write a loop statement that iterates through the values 0 to 4 using range() and prints each index.",
        starter: '# Write your loop here\n',
        testCode: 'for i in range(5): && print(i)',
        theory: "Loops handle repetitious logic efficiently. The <code>for i in range(5)</code> loop performs 5 iterations, producing values sequentially from 0 up to 4.",
        analogy: "A stamping line conveyor. The belt advances 5 times, stamping rising invoice index numbers from 0 to 4 onto boxes.",
        difficulty: "DYNAMICS"
      },
      {
        number: 5,
        title: "Custom Functions & Parameters",
        problem: "Define a function named 'greeting' accepting parameter 'name' that returns 'Hello ' concatenated with the name.",
        starter: '# Define function below\n',
        testCode: 'def greeting(name): && return "Hello " + name',
        theory: "Functions represent isolated, reusable blocks of logic declared using the <code>def</code> keyword. They take parameters as input and emit outputs via the <code>return</code> statement.",
        analogy: "A processing hopper. Drop a card with a name into the receiver slot, gears rotate inside, and it spits out a polished greeting label.",
        difficulty: "DYNAMICS"
      },
      {
        number: 6,
        title: "Dynamic Lists & Elements",
        problem: "Create an empty list called 'items', then append the numbers 10 and 20 to it.",
        starter: '# Create items list below\nitems = []\n',
        testCode: 'items.append(10) && items.append(20)',
        theory: "Lists are mutable sequential collections. Using <code>.append()</code> adds items dynamically to the end of the collection without manual size pre-allocation.",
        analogy: "A chain of empty train carts. Every time a crane finishes loading cargo, a new cart is coupled onto the rear.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 7,
        title: "Dictionary Catalogs (HashMaps)",
        problem: "Create a dictionary named 'user' containing key-value pairs for 'id' set to 1 and 'name' set to 'Alex'.",
        starter: '# Create user dict below\n',
        testCode: 'user = { && "id": 1 && "name": "Alex"',
        theory: "Dictionaries model highly efficient key-value catalogs. They map hashable labels directly to variables, yielding incredibly rapid search lookups.",
        analogy: "A postbox wall with custom labels. Slot one is marked 'id', slot two is marked 'name', each storing matching mail.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 8,
        title: "Standard Libraries (Math)",
        problem: "Import the standard 'math' library and output the square root of 64 using math.sqrt().",
        starter: '# Import math and call square root below\n',
        testCode: 'import math && math.sqrt(64)',
        theory: "Python includes a wealth of built-in tooling via modules. The <code>math</code> package provides direct hardware-optimized triggers for advanced algebraic operations.",
        analogy: "Inviting a specialist tool designer onto your workbench, carrying a slide rule to instantly calculate complex roots.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 9,
        title: "Native File Handling (I/O)",
        problem: "Write code that opens a file named 'data.txt' in read-only mode using 'with open' and binds it to 'f'.",
        starter: '# Open file below\n',
        testCode: 'with open("data.txt", "r") as f:',
        theory: "Using the <code>with</code> command context manager ensures that file descriptors are automatically closed after logic execution, preventing memory leaks and hardware locks.",
        analogy: "Putting on a pairs of safety gloves before opening an archive cabinet, which automatically snap back closed when you step away.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 10,
        title: "Custom Classes & OOP Structures",
        problem: "Define a class named 'Vehicle' with an __init__ constructor accepting parameter 'brand' and assigning it to self.brand.",
        starter: '# Declare class below\n',
        testCode: 'class Vehicle: && def __init__(self, brand): && self.brand = brand',
        theory: "Classes formulate blueprints for Object-Oriented programming. The <code>__init__</code> constructor initializes the specific state parameters when spawning class objects.",
        analogy: "Drafting a mechanical stamp blueprint for making a series of concrete trucks. Custom branding tags are riveted on as they leave the production line.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 11,
        title: "Robust Exception Handling",
        problem: "Construct a try-except structure. In the try block, call int('abc'). In the except block for 'ValueError', set 'err_code' to 500.",
        starter: '# Write try-except blocks below\n',
        testCode: 'try: && int("abc") && except ValueError: && err_code = 500',
        theory: "Exception blocks isolate fragile program routines. If standard operations raise errors, Python immediately jumps to the matches <code>except</code> block.",
        analogy: "Enclosing a high-voltage fuse box. If current triggers a fuse melt (ValueError), control immediately diverges to backup battery generators.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 12,
        title: "External Network API Requests",
        problem: "Import the 'requests' package and execute a GET payload trigger targeting the path 'https://api.com'.",
        starter: '# Import requests and fire test below\n',
        testCode: 'import requests && requests.get("https://api.com")',
        theory: "The standard third-party <code>requests</code> package enables full-scale HTTP interaction directly, connecting your local environment to external web ecosystems.",
        analogy: "Sending an automated courier drone across town with an empty messenger envelope; it flies to the central plaza and returns with a structured delivery slip.",
        difficulty: "ARCHITECT_SYSTEMS"
      }
    ]
  },
  javascript: {
    id: "javascript",
    name: "JavaScript Web Tech",
    icon: "Cpu",
    color: "#eab308",
    category: "Dynamic Web Interactions",
    description: "The core engine of client-side web browsers, modern asynchronous tasks, APIs, and functional transformations.",
    libraryReferences: [
      {
        name: "Lodash",
        category: "Utility Library",
        purpose: "A modern JavaScript utility library delivering modularity, performance, and extras for working with arrays, numbers, and objects.",
        example: "import _ from 'lodash';\nconst combined = _.chunk(['a', 'b', 'c', 'd'], 2);\nconsole.log(combined);",
        docUrl: "https://lodash.com"
      },
      {
        name: "React",
        category: "User Interfaces",
        purpose: "A popular, component-based frontend library for building highly interactive single-page web applications.",
        example: "import React, { useState } from 'react';\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
        docUrl: "https://react.dev"
      },
      {
        name: "Axios",
        category: "Network Client",
        purpose: "Promise-based HTTP client for the browser and Node.js that handles requests with ease.",
        example: "import axios from 'axios';\naxios.get('/api/users')\n  .then(res => console.log(res.data))\n  .catch(err => console.error(err));",
        docUrl: "https://axios-http.com"
      }
    ],
    floors: [
      {
        number: 1,
        title: "Modern Variables & Scoping",
        problem: "Create a block-scoped variable named 'count' and initialize it with the value of 10 using let.",
        starter: '// Initialize coordinate below\n',
        testCode: 'let count = 10',
        theory: "JavaScript utilizes <code>let</code> and <code>const</code> for block-scoped declarations, replacing the older, error-prone function-scoped <code>var</code>.",
        analogy: "Writing down a temporary coordinate on a local office chalkboard. It stays visible as long as you work in that localized section.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Logical If-Else Routing",
        problem: "Compose a conditional check evaluating 'count > 5'. If true, print 'High' using console.log; otherwise, print 'Low'.",
        starter: 'let count = 10;\n// Write conditional check below\n',
        testCode: 'if (count > 5) { && console.log("High") && } else { && console.log("Low") && }',
        theory: "Conditional branches in JS evaluate relational operations, running respective code blocks wrapped inside curly braces.",
        analogy: "A pressure-sensitive gate door. If weight readings exceed 5 tons, the gate opens the 'High' bypass route; otherwise, it vents into the 'Low' exhaust channel.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Reusable Functional Nodes",
        problem: "Write a function declared as 'add' that accepts parameters 'a' and 'b' and returns their sum.",
        starter: '// Define add function below\n',
        testCode: 'function add(a, b) { && return a + b && }',
        theory: "Functions organize logic into isolated routines. They facilitate parameter mapping and output passing via explicit <code>return</code> statements.",
        analogy: "An automated mixing machine with two steel funnel inlets. Dump components inside, it welds them together, and spits out combined material.",
        difficulty: "DYNAMICS"
      },
      {
        number: 4,
        title: "Array Mapping (Transformations)",
        problem: "Given an array 'nums = [1, 2, 3]', call map() on it using an arrow function to double each element.",
        starter: 'const nums = [1, 2, 3];\n// Transform numbers below\nconst doubled = ',
        testCode: 'nums.map(x => x * 2) || nums.map((x) => x * 2)',
        theory: "The modern array method <code>.map()</code> iterates through arrays, applying inline arrow callback transformations to return a brand new array.",
        analogy: "A conveyor passing under a spray-nozzle. Every part passing underneath is instantly varnished and exits with a double glaze.",
        difficulty: "DYNAMICS"
      },
      {
        number: 5,
        title: "Object-Destructuring Shorthand",
        problem: "Using ES6 destructuring, extract the fields 'name' and 'id' into constants from user object.",
        starter: 'const user = { id: 7, name: "Maria", role: "admin" };\n// Destructure fields below\n',
        testCode: 'const { name, id } = user || const { id, name } = user',
        theory: "Object destructuring is a powerful shorthand that pulls nested fields out of structured objects and binds them to standalone local variables instantly.",
        analogy: "Pliers and screwdriver are pulled from a heavy toolbox and lined up directly on your tool belt, leaving other bulky machinery behind.",
        difficulty: "DYNAMICS"
      },
      {
        number: 6,
        title: "Arrow Function Formulations",
        problem: "Declare a constant function named 'multiply' that takes structural parameter 'x' and returns 'x * 2' in inline arrow format.",
        starter: '// Declare arrow function multiply below\n',
        testCode: 'const multiply = x => x * 2 || const multiply = (x) => x * 2',
        theory: "Arrow functions provide clean, concise syntax. If there is only a single expression, curly braces and explicit return commands can be completely bypassed.",
        analogy: "A magnetic vacuum bypass tube. A projectile flies in, is instantly doubled in size, and sails out the back end with no gate stops.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 7,
        title: "Universal Promises (Wait Timers)",
        problem: "Construct a Promise that accepts a resolver callback 'resolve' and resolves with 'done' inside.",
        starter: '// Return a target Promise below\n',
        testCode: 'new Promise((resolve) => resolve("done")) || new Promise(resolve => resolve("done"))',
        theory: "Promises model future completion values of asynchronous tasks. State transitions can resolve toward standard outputs or reject toward faults.",
        analogy: "Receiving a ticket coupon at a cargo deck. You go sit down, and when the whistle blows, you swap the ticket coupon for the actual cargo boxes.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 8,
        title: "Asynchronous Pipelines",
        problem: "Write an async function declared as 'fetchData' that awaits a call to 'getMetrics()'.",
        starter: 'async function getMetrics() { return "data"; }\n// Declare async function fetchData below\n',
        testCode: 'async function fetchData() { && await getMetrics() && }',
        theory: "The keywords <code>async</code> and <code>await</code> wrap asynchronous promises, enabling developers to write linear-looking code that doesn't block CPU threads.",
        analogy: "Ordering Custom bricks. Instead of locking up the assembly line, the crew keeps busy with other layouts while awaiting structural deliveries.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 9,
        title: "Modern API Communications",
        problem: "Execute a fetch statement targeting 'url' and chain the JSON callback '.then(res => res.json())'.",
        starter: 'const url = "/api/health";\n// Trigger fetch below\n',
        testCode: 'fetch(url).then(res => res.json()) || fetch(url).then((res) => res.json())',
        theory: "Web browsers query online services using the <code>fetch()</code> API. It handles promises and decodes incoming binary buffers into readable arrays.",
        analogy: "Shouting into a tube intercom across town, listening back for a rhythmic chime verifying the central office has accepted the order.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 10,
        title: "Browser Cache Persistence",
        problem: "Write a localStorage handler storing 'token' key matching variable value 'xyz123'.",
        starter: '// Set storage item below\n',
        testCode: 'localStorage.setItem("token", "xyz123")',
        theory: "The <code>localStorage</code> API stores persistent string records on client browsers. Data is retained across session boots.",
        analogy: "Stowing a physical notebook in a desk folder slot. When returning tomorrow morning, you can retrieve the previous day's notes.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 11,
        title: "Custom ES6 Classes",
        problem: "Define a class named 'User' with a constructor accepting parameter 'name' and mapping to 'this.name'.",
        starter: '// Create ES6 class below\n',
        testCode: 'class User { && constructor(name) { && this.name = name && } && }',
        theory: "Classes in JavaScript represent stylistic syntax wrapping prototypes. They formulate structured class templates for object generation.",
        analogy: "Writing structural molds specifying slot layout allocations for building bricks.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 12,
        title: "Global JSON Transformations",
        problem: "Convert the string object 'str' into a runtime javascript object using JSON.parse().",
        starter: 'const str = \'{"id": 1}\';\n// Deserialize str below\nconst obj = ',
        testCode: 'JSON.parse(str)',
        theory: "JSON acts as the transport language of the web. <code>JSON.parse()</code> deserializes strings into active arrays; <code>JSON.stringify()</code> completes the reverse.",
        analogy: "Unfolding a tightly packed shipping cargo box and sorting raw component registers onto your active workbench for installation.",
        difficulty: "ARCHITECT_SYSTEMS"
      }
    ]
  },
  sql: {
    id: "sql",
    name: "SQL Data Syllabus",
    icon: "Database",
    color: "#06b6d4",
    category: "Relational Storage Management",
    description: "Structuring, indexing, query filtering, and high-performance transactional database architectures.",
    libraryReferences: [
      {
        name: "Drizzle ORM",
        category: "Database Mapping (ORM)",
        purpose: "A next-generation TypeScript ORM that runs SQL queries with type safety and intuitive schemas.",
        example: "import { pgTable, serial, text } from 'drizzle-orm/pg-core';\nexport const users = pgTable('users', {\n  id: serial('id').primaryKey(),\n  name: text('name')\n});",
        docUrl: "https://orm.drizzle.team"
      },
      {
        name: "Prisma",
        category: "Database Mapping (ORM)",
        purpose: "Declarative database schema client that automates migrations and maps to relational databases seamlessly.",
        example: "const prisma = new PrismaClient();\nconst allUsers = await prisma.user.findMany();\nconsole.log(allUsers);",
        docUrl: "https://prisma.io"
      },
      {
        name: "SQLite",
        category: "Embedded Database",
        purpose: "A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.",
        example: "import sqlite3 from 'sqlite3';\nconst db = new sqlite3.Database(':memory:');\ndb.serialize(() => {\n  db.run('CREATE TABLE users (name TEXT)');\n});",
        docUrl: "https://sqlite.org"
      }
    ],
    floors: [
      {
        number: 1,
        title: "Global Grid Queries",
        problem: "Write an SQL query to retrieve all database records from the 'users' directory table.",
        starter: '-- Perform global query below\n',
        testCode: 'SELECT * FROM users',
        theory: "Relational databases index files in rows. Using the asterisk wildcard <code>*</code> grabs all column types inside the target table.",
        analogy: "Opening a filing drawer labeled 'users', taking out all document folders, and dumping them onto the inspection desk.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Condition Filtering",
        problem: "Write an SQL query getting all columns from the 'products' table where 'price' is greater than 50.",
        starter: '-- Add filtered select below\n',
        testCode: 'SELECT * FROM products WHERE price > 50',
        theory: "The <code>WHERE</code> clause acts as a query gate. It screens records, returning rows that match the required mathematical condition.",
        analogy: "A mechanical sifter. Files slide over a mesh; only items priced over $50 drop into the collectors below.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Sorting & Dimension Gates",
        problem: "Query all products ordered by 'price' descending, and limit the returned dataset to the top 5 records.",
        starter: 'SELECT * FROM products ',
        testCode: 'ORDER BY price DESC && LIMIT 5',
        theory: "Using <code>ORDER BY ... DESC</code> sorts numerical data, while <code>LIMIT</code> prevents high-volume servers from returning overly large arrays.",
        analogy: "Gathering all catalog sheets, sorting them from highest value to lowest, and handing the supervisor only the top 5 sheets from the pile.",
        difficulty: "DYNAMICS"
      },
      {
        number: 4,
        title: "Relational Table Unions",
        problem: "Query an inner query joining 'orders' and 'users' based on 'orders.user_id' being equal to 'users.id'.",
        starter: 'SELECT * FROM orders\n',
        testCode: 'INNER JOIN users ON && orders.user_id = users.id',
        theory: "Relational joins merge tables. <code>INNER JOIN</code> bridges distinct datasets by cross-referencing keys, outputting a consolidated matrix grid.",
        analogy: "Stitching client logbooks to their shipping manifests by checking that the barcode ID matches perfectly on both documents.",
        difficulty: "DYNAMICS"
      },
      {
        number: 5,
        title: "Aggregate Metrics Groups",
        problem: "Calculate total rows in 'sales' grouped by 'category' using COUNT(*) and GROUP BY commands.",
        starter: 'SELECT category, COUNT(*) FROM sales ',
        testCode: 'GROUP BY category',
        theory: "Aggregation operations perform global math on columns. Using <code>GROUP BY</code> splits records into segments and returns metrics for each group.",
        analogy: "Sorting receipts into separate piles based on department, then counting the receipts in each stack.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 6,
        title: "Inserting New Record Cargo",
        problem: "Insert a new row into the table 'customers' specifying name 'Alex' and age 30 in the schema columns.",
        starter: '-- Perform insert query below\n',
        testCode: 'INSERT INTO customers (name, age) VALUES ("Alex", 30) || INSERT INTO customers (name, age) VALUES (\'Alex\', 30)',
        theory: "Manipulating table registers requires <code>INSERT INTO</code>. This registers new structural record fields into relational tables safely.",
        analogy: "Filling out a new blank tenant onboarding document, writing the tenant's details on it, and sliding it into the file cabinet drawer.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 7,
        title: "Modifying Existing Columns",
        problem: "Write an SQL statement updating 'users' table, setting 'role' to 'admin' where 'id' is equal to 1.",
        starter: '-- Perform update statement below\n',
        testCode: 'UPDATE users SET role = "admin" WHERE id = 1 || UPDATE users SET role = \'admin\' WHERE id = 1',
        theory: "Using <code>UPDATE</code> replaces individual record values inside specific rows targeted with <code>WHERE</code> clauses.",
        analogy: "Searching for client file number 1 inside archives, pulling out the card, and stamping the designation 'admin' onto the career line.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 8,
        title: "Record Erasure Procedures",
        problem: "Create a query to completely delete all entries inside the 'logs' table where 'status' equals 'obsolete'.",
        starter: '-- Perform delete statement below\n',
        testCode: 'DELETE FROM logs WHERE status = "obsolete" || DELETE FROM logs WHERE status = \'obsolete\'',
        theory: "The <code>DELETE</code> command completely voids targeted registers. If no <code>WHERE</code> clause is declared, entire tables are wiped out.",
        analogy: "Running down catalog lists with black indicators, sliding everything containing an 'obsolete' badge into paper shredders.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 9,
        title: "Nested SQL Subqueries",
        problem: "Execute a SELECT getting names from 'items' where 'id' is IN a subquery: '(SELECT item_id FROM sales)'.",
        starter: 'SELECT name FROM items WHERE ',
        testCode: 'id IN (SELECT item_id FROM sales)',
        theory: "Subqueries nest evaluations together. The inner query resolves first, providing a dynamic filter pool for the outer query.",
        analogy: "Pulling a checklist of items sold today, then cross-referencing it with the main price directory to retrieve their names.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 10,
        title: "High-Performance Indices",
        problem: "Write an index creation command named 'idx_email' targeting 'email' column under 'users' table.",
        starter: '-- Create index structure below\n',
        testCode: 'CREATE INDEX idx_email ON users(email) || CREATE INDEX idx_email ON users (email)',
        theory: "Indexes build background sorting registries. They significantly accelerate dataset lookups by avoiding full table scans.",
        analogy: "Constructing a highly sorted index card catalog near library doorways, enabling visitors to run directly to designated book shelves.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 11,
        title: "Dynamic Schema Alterations",
        problem: "Write an alter statement appending a new column named 'phone' of type 'VARCHAR' to the table 'users'.",
        starter: '-- Alter table statement below\n',
        testCode: 'ALTER TABLE users ADD COLUMN phone VARCHAR || ALTER TABLE users ADD phone VARCHAR',
        theory: "Manipulating database schemas requires <code>ALTER TABLE</code>. This lets engineers add, remove, or modify database column constraints dynamically.",
        analogy: "Riveting an extra blank slot on the side of every single file card folder in archives so records can store phone numbers.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 12,
        title: "Distinct Selection Filtering",
        problem: "Write a select query retrieving only unique, distinct values of the column 'role' from 'users' table.",
        starter: '-- Selection unique rows below\n',
        testCode: 'SELECT DISTINCT role FROM users',
        theory: "The <code>DISTINCT</code> keyword screens out repeated duplicates, summarizing only the unique occurrences of a column value.",
        analogy: "Taking a whole stack of receipts and listing only the unique categories represented, omitting duplicate entries.",
        difficulty: "ARCHITECT_SYSTEMS"
      }
    ]
  },
  html: {
    id: "html",
    name: "HTML/CSS UI Scaffold",
    icon: "Layout",
    color: "#f97316",
    category: "Structural Interface Layouts",
    description: "The core markup skeleton, semantic elements, and responsive layout styling.",
    libraryReferences: [
      {
        name: "Tailwind CSS",
        category: "Styling Framework",
        purpose: "Utility-first CSS framework for rapid user interface styling directly inside markup code.",
        example: "<div class=\"p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4\">\n  <div class=\"text-xl font-medium text-black\">ChitChat</div>\n  <p class=\"text-gray-500\">You have a new message!</p>\n</div>",
        docUrl: "https://tailwindcss.com"
      },
      {
        name: "Bootstrap",
        category: "Component Library",
        purpose: "A popular responsive, mobile-first component toolkit for building responsive layouts instantly.",
        example: "<div class=\"alert alert-primary\" role=\"alert\">\n  A simple primary alert—check it out!\n</div>",
        docUrl: "https://getbootstrap.com"
      },
      {
        name: "Sass",
        category: "CSS Preprocessor",
        purpose: "An extension of CSS that adds nesting, variables, mixins, and inheritance to standard layouts.",
        example: "$font-stack: Helvetica, sans-serif;\n$primary-color: #333;\nbody {\n  font: 100% $font-stack;\n  color: $primary-color;\n}",
        docUrl: "https://sass-lang.com"
      }
    ],
    floors: [
      {
        number: 1,
        title: "Headings & Document Hierarchy",
        problem: "Create an h1 heading element displaying the textual logo 'Main Dashboard' exactly.",
        starter: '<!-- Create h1 header here -->\n',
        testCode: '<h1>Main Dashboard</h1>',
        theory: "The HTML <code>&lt;h1&gt;</code> element represents the highest-priority heading block in a document, establishing initial content-structure ranks.",
        analogy: "Bolting an oversized glowing storefront sign onto the building layout, visible to anyone stepping into the sector.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Standard Text Paragraphs",
        problem: "Create a paragraph container explaining course metrics with the text 'Welcome Students' exactly.",
        starter: '<!-- Write paragraph tag below -->\n',
        testCode: '<p>Welcome Students</p>',
        theory: "Paragraph <code>&lt;p&gt;</code> elements structure body text. Browsers automatically append clean top and bottom margins to keep paragraphs legible.",
        analogy: "Arranging printed user manual guidelines neatly on a display desk to present clear instructions to citizens.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Hyperlinks & System Anchors",
        problem: "Create an anchor element linking to 'https://google.com' labeled 'Search' exactly.",
        starter: '<!-- Insert anchor tag below -->\n',
        testCode: '<a href="https://google.com">Search</a>',
        theory: "Hyperlinks use the <code>&lt;a&gt;</code> (anchor) element. The <code>href</code> attribute defines the objective network path for navigation.",
        analogy: "Installing a high-speed travel portal labeled 'Search' that transports workers to the central town plaza instantly.",
        difficulty: "DYNAMICS"
      },
      {
        number: 4,
        title: "Structural Layout Divisions",
        problem: "Construct a container block div utilizing CSS class 'container' containing text inside.",
        starter: '<!-- Build layout divider below -->\n',
        testCode: '<div class="container"> && </div>',
        theory: "Divisions <code>&lt;div&gt;</code> are generic blocks. They don't represent semantic data, instead acting as flex anchors to lock sibling layouts together.",
        analogy: "Establishing load-bearing room partition walls to separate distinct work zones inside a main building floor.",
        difficulty: "DYNAMICS"
      },
      {
        number: 5,
        title: "Interactive Form Inputs",
        problem: "Declare an input text element carrying placeholder value 'Enter email' on the browser screen.",
        starter: '<!-- Create input slot below -->\n',
        testCode: '<input type="text" placeholder="Enter email"> || <input placeholder="Enter email"',
        theory: "The <code>&lt;input&gt;</code> element accepts dynamic user input. Adding a <code>placeholder</code> guides citizens on what data they should type.",
        analogy: "Slipping a blank form box onto an reception desk, requesting visitors to scribble down their email before entry.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 6,
        title: "Action Trigger Buttons",
        problem: "Construct an active form submit button labeled with the text 'Submit' exactly.",
        starter: '<!-- Construct button below -->\n',
        testCode: '<button type="submit">Submit</button> || <button>Submit</button>',
        theory: "A <code>&lt;button&gt;</code> represents a clickable trigger that fires script routines or submits input values to backend modules.",
        analogy: "A large physical start-override button on a console. Slapping the button sends raw signal pulses through the wires.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 7,
        title: "Inline Styling Attributes",
        problem: "Create a paragraph element carrying red text styling by specifying inline style='color: red;'.",
        starter: '<!-- Create colored text below -->\n',
        testCode: '<p style="color: red;"> || <p style="color:red"',
        theory: "Inline styling allows quick, high-priority utility overriding. Best practice recommends central CSS files, but styles map directly to tags.",
        analogy: "Unrolling a roll of red hazard tape and wrapping it directly around a structural pole instead of coding the blueprint catalog.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 8,
        title: "Advanced Data Forms",
        problem: "Declare an active form wrapper pointing to '/submit' via POST method specifications.",
        starter: '<!-- Define form wrapper here -->\n',
        testCode: '<form action="/submit" method="post"> || <form method="post" action="/submit"',
        theory: "Forms gather interactive user inputs and bundle them into standard HTTP request payloads targeted to backend servers.",
        analogy: "Deploying a structured shipping bin with an address label attached to its front, ready to collect all customer packages.",
        difficulty: "DYNAMICS"
      },
      {
        number: 9,
        title: "Unordered Lists & Nodes",
        problem: "Build an unordered list header containing at least one list item representing 'Admin'.",
        starter: '<!-- Create list below -->\n',
        testCode: '<ul> && <li>Admin</li> && </ul>',
        theory: "Listed collections are marked with <code>&lt;ul&gt;</code> for bullet arrays, or <code>&lt;ol&gt;</code> for numbered sequences. Kids are enclosed inside <code>&lt;li&gt;</code> tags.",
        analogy: "Hanging up a list organizer board on the warehouse wall, with individual hanging tool card tags beneath it.",
        difficulty: "DYNAMICS"
      },
      {
        number: 10,
        title: "Graphic Image Tags",
        problem: "Create a responsive image reference to 'logo.png' stating referrerPolicy='no-referrer'.",
        starter: '<!-- Define image element below -->\n',
        testCode: '<img src="logo.png" referrerpolicy="no-referrer"> || referrerPolicy="no-referrer"',
        theory: "Images use the self-closing <code>&lt;img&gt;</code> tag. The <code>src</code> attribute points to asset paths, and referrer settings prevent tracking.",
        analogy: "Carving out a slot on a drywall panel to place a canvas picture frame securely inside.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 11,
        title: "Scalable Responsive Viewports",
        problem: "Construct a meta viewport settings tag aligning standard scale widths directly to device dimensions.",
        starter: '<!-- Specify viewport metadata below -->\n',
        testCode: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        theory: "Viewports let browsers render layouts correctly on mobile screens by locking the digital pixel scaling directly to hardware widths.",
        analogy: "Adjusting focus dials on a slide projector to match the exact dimensions of the screen so text stays legible.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 12,
        title: "Semantic Content Navigations",
        problem: "Utilize the modern semantic 'nav' block tag to house standard navigation links.",
        starter: '<!-- Add semantic header nav below -->\n',
        testCode: '<nav> && </nav>',
        theory: "Modern semantic containers (<code>&lt;nav&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>) replace endless generic divs, helping screen readers parse page architecture.",
        analogy: "Erecting dedicated information booths clearly colored with signs, rather than building generic concrete brick partitions.",
        difficulty: "ARCHITECT_SYSTEMS"
      }
    ]
  },
  rust: {
    id: "rust",
    name: "Rust Safe Core",
    icon: "ShieldAlert",
    color: "#f5591c",
    category: "Memory Safe System Languages",
    description: "System engineering featuring compile-time lifetimes, secure borrow rules, and concurrent thread processing.",
    libraryReferences: [
      {
        name: "Serde",
        category: "Data Serialization",
        purpose: "An extremely fast and generic framework for serializing and deserializing Rust data structures efficiently.",
        example: "[derive(Serialize, Deserialize)]\nstruct User {\n    id: u32,\n    name: String,\n}",
        docUrl: "https://serde.rs"
      },
      {
        name: "Tokio",
        category: "Asynchronous Runtime",
        purpose: "An asynchronous runtime for the Rust programming language supplying event-driven network loops.",
        example: "#[tokio::main]\nasync fn main() {\n    println!(\"Running in asynchronous runtime!\");\n}",
        docUrl: "https://tokio.rs"
      },
      {
        name: "Clap",
        category: "CLI Argument Parser",
        purpose: "A full-featured, fast, and simple-to-use Command Line Argument Parser for building command-line applications.",
        example: "use clap::Parser;\n#[derive(Parser)]\nstruct Cli {\n    name: String,\n}",
        docUrl: "https://docs.rs/clap"
      }
    ],
    floors: [
      {
        number: 1,
        title: "Immutable Value Allotments",
        problem: "In Rust, declare an immutable variable named 'x' and bind the value 42 to it.",
        starter: 'fn main() {\n  // Code variable binding below\n}',
        testCode: 'let x = 42',
        theory: "In Rust, variables are strictly immutable by default. This makes multithreading safe because other modules can't scramble target memory.",
        analogy: "Stamping values onto a heavy metal plate. It is welded in place; workers can't scribble over it without starting over.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Mutable Storage Overrides",
        problem: "Create a mutable variable 'count' initialized to 0, then increment it by 1 on the next line.",
        starter: 'fn main() {\n  // Create mutable count below\n}',
        testCode: 'let mut count = 0 && count += 1 || count = count + 1',
        theory: "Modifying variables requires explicit declaration using the <code>mut</code> keyword, alerting compilation checks to monitor access states.",
        analogy: "Removing the metal seal on a dial slider, allowing staff to rotate the value on demand.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Active Memory Borrowing",
        problem: "Borrow a read-only pointer reference of variable 'x' and assign the borrow directly to variable 'r'.",
        starter: 'fn main() {\n  let x = 500;\n  // Borrow pointer address below\n}',
        testCode: 'let r = &x',
        theory: "The borrow checker enforces safe usage. The ampersand prefix <code>&amp;</code> gives read access without claiming ownership, avoiding memory leak hazards.",
        analogy: "Handing coworkers a PDF photocopy of a map. They can read details, but they don't own the original paper blueprints.",
        difficulty: "DYNAMICS"
      },
      {
        number: 4,
        title: "Dynamic Vector Slabs",
        problem: "Create a mutable vector named 'v' holding numbers 1, 2, and 3 using the vec! macro.",
        starter: 'fn main() {\n  // Initialize vector v below\n}',
        testCode: 'let mut v = vec![1, 2, 3]',
        theory: "Vectors are heap-allocated sequential blocks. The <code>vec!</code> macro streamlines memory allocations at compile-time.",
        analogy: "An expandable storage vault on a track. It stretches dynamically as you slide extra blocks inside.",
        difficulty: "DYNAMICS"
      },
      {
        number: 5,
        title: "Pattern Sorter Matchers",
        problem: "Define a match comparison on variable 'status' checking 'Some(v)' and 'None' outcomes.",
        starter: 'fn check(status: Option<i32>) {\n  // Match outcomes here\n}',
        testCode: 'match status { && Some(v) => && None =>',
        theory: "Pattern matching in Rust uses the <code>match</code> keyword to cover all potential enum outcomes, avoiding unexpected runtime null bugs.",
        analogy: "A courier package scanner. Packages slide inside; a laser scans them, and they are sorted precisely to slot Some(v) or slot None.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 6,
        title: "Custom Design Structs",
        problem: "Create a struct declared as 'User' holding fields for id of type u32, and name of type String.",
        starter: '// Build User struct below\n',
        testCode: 'struct User { && id: u32 && name: String',
        theory: "Structs are custom data models that compile down to highly dense, structured binary layout records.",
        analogy: "An empty mold in a bricks factory. It contains sockets for IDs and names, stamping out sturdy composite blocks.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 7,
        title: "Enumeration Choice Pools",
        problem: "Declare a public enum named 'Direction' with three variants: Up, Down, and Neutral.",
        starter: '// Declare enum Below\n',
        testCode: 'enum Direction { && Up && Down && Neutral',
        theory: "Enums represent types containing finite sets of options. They lock operations down to valid designated choices only.",
        analogy: "A multi-way directional control lever on a heavy loader. It physically locks into discrete paths: Up, Down, or Neutral.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 8,
        title: "Result Handlers (Errors)",
        problem: "Declare a function signature returning a Result type mapping output 'i32' or error 'String'.",
        starter: '// Write function header returning Result\n',
        testCode: 'Result<i32, String>',
        theory: "Rust avoids throwing runtime exceptions. Instead, it expresses risk using the robust monadic <code>Result&lt;T, E&gt;</code> type.",
        analogy: "A conveyor system that drops item T in the green bin, or error message E in the red tray when things fail.",
        difficulty: "DYNAMICS"
      },
      {
        number: 9,
        title: "Behavior Implementations",
        problem: "Write an 'impl' header matching class 'User' to define custom internal class methods.",
        starter: 'struct User { id: u32 }\n// Declare impl block below\n',
        testCode: 'impl User {',
        theory: "Using the <code>impl</code> block attaches active behaviors, constructs, and functions to data structs.",
        analogy: "Welding operational control switches and dashboards directly onto the chassis of a brick casing machine.",
        difficulty: "DYNAMICS"
      },
      {
        number: 10,
        title: "Reusable Class Traits",
        problem: "Define a trait structure named 'Render' holding a function signature 'fn render(&self) -> String;'.",
        starter: '// Write Render trait definition below\n',
        testCode: 'trait Render { && fn render(&self) -> String',
        theory: "Traits represent interface patterns. They formulate standardized performance bounds that classes or structs must implement.",
        analogy: "Drafting a universal hardware plug connector spec. Anything matching the socket layout can link to system power loops.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 11,
        title: "Secure Value Lifetimes",
        problem: "Declare a reference holder function signature with explicit lifetime indicator ''a'.",
        starter: '// Add lifetime marker in parameters below\n',
        testCode: "fn process<'a>(s: &'a str) -> &'a str || <'a>",
        theory: "Lifetimes are references tracking systems. They prevent 'dangling dangling pointers' by proving references outlive data blocks.",
        analogy: "Stamping expiration date-codes onto visitor entry passes; the passes expire immediately when folders are archived.",
        difficulty: "ARCHITECT_SYSTEMS"
      },
      {
        number: 12,
        title: "Multi-threaded Spawning",
        problem: "Write a thread spawn command using std::thread::spawn and pass an active move closure.",
        starter: '// Spawn concurrent thread here\n',
        testCode: 'std::thread::spawn(move || || thread::spawn(move ||',
        theory: "Thread spawning enables high-performance asynchronous workflows. Moving parameters inside isolates states securely.",
        analogy: "Delegating construction to a separate autonomous labor crew, while continuing master line assembly back in the control center.",
        difficulty: "ARCHITECT_SYSTEMS"
      }
    ]
  }
};
