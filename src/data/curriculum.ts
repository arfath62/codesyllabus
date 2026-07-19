import { City } from "../types";

export const CURRICULUM: Record<string, City> = {
  python: {
    id: "python",
    name: "Python",
    icon: "Terminal",
    color: "#3B82F6",
    category: "General Purpose",
    description: "Learn Python fundamentals and master this versatile language.",
    floors: [
      {
        number: 1,
        title: "Hello World",
        problem: "Write a program that prints 'Hello, World!' to the console.",
        starter: "# Write your code here\nprint()",
        testCode: "print('Hello, World!')",
        theory: "The print() function outputs text to the console.",
        analogy: "Like speaking out loud to someone.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Variables & Types",
        problem: "Create a variable named 'name' with your name and print it.",
        starter: "# Define a variable here\n",
        testCode: "name = 'Alice'\nprint(name)",
        theory: "Variables store data. Python infers types automatically.",
        analogy: "Like labeled boxes storing different items.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Functions",
        problem: "Define a function that returns the sum of two numbers.",
        starter: "def add(a, b):\n    # Write your code here\n    pass",
        testCode: "def add(a, b):\n    return a + b\nprint(add(2, 3))",
        theory: "Functions are reusable blocks of code that perform specific tasks.",
        analogy: "Like a recipe that takes ingredients and produces a dish.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  javascript: {
    id: "javascript",
    name: "JavaScript",
    icon: "Cpu",
    color: "#F3D74E",
    category: "Web Development",
    description: "Master JavaScript and build dynamic web applications.",
    floors: [
      {
        number: 1,
        title: "Console Output",
        problem: "Log 'Hello, World!' to the browser console.",
        starter: "// Write your code here\n",
        testCode: "console.log('Hello, World!');",
        theory: "console.log() outputs messages to the developer console.",
        analogy: "Like printing debug information to understand program flow.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Variables",
        problem: "Declare a variable and assign it a value.",
        starter: "// Create a variable named 'name'\n",
        testCode: "let name = 'Bob';\nconsole.log(name);",
        theory: "Variables hold data. Use let, const, or var to declare them.",
        analogy: "Like naming containers to store and retrieve data.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Functions",
        problem: "Write a function that multiplies two numbers.",
        starter: "function multiply(a, b) {\n  // Your code here\n}\n",
        testCode: "function multiply(a, b) {\n  return a * b;\n}\nconsole.log(multiply(3, 4));",
        theory: "Functions encapsulate logic and can be reused throughout code.",
        analogy: "Like creating your own command that can be called anywhere.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  html: {
    id: "html",
    name: "HTML",
    icon: "Layout",
    color: "#FF6B35",
    category: "Web Development",
    description: "Build the structure of web pages with HTML.",
    floors: [
      {
        number: 1,
        title: "Basic Page Structure",
        problem: "Create a simple HTML page with a heading.",
        starter: "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Add your heading here -->\n</body>\n</html>",
        testCode: "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>",
        theory: "HTML provides semantic structure to web content.",
        analogy: "Like the blueprint of a building that defines its rooms and layout.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Text Elements",
        problem: "Add a paragraph with some text content.",
        starter: "<p></p>\n",
        testCode: "<p>This is a paragraph of text.</p>\n",
        theory: "<p> tags define paragraphs; <h1>-<h6> define headings of different sizes.",
        analogy: "Like organizing text into chapters and sections of a book.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Links & Attributes",
        problem: "Create a hyperlink to example.com.",
        starter: "<a></a>\n",
        testCode: "<a href=\"https://example.com\">Visit Example</a>\n",
        theory: "The <a> tag creates hyperlinks; href points to the destination.",
        analogy: "Like writing footnotes that reference other documents.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  sql: {
    id: "sql",
    name: "SQL",
    icon: "Database",
    color: "#4ECDC4",
    category: "Data Management",
    description: "Query and manage data with SQL.",
    floors: [
      {
        number: 1,
        title: "SELECT Basics",
        problem: "Select all rows from a users table.",
        starter: "SELECT\nFROM users;",
        testCode: "SELECT * FROM users;",
        theory: "SELECT retrieves data; * means all columns.",
        analogy: "Like asking: 'Show me all the information in this spreadsheet.'",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "WHERE Clause",
        problem: "Select users with age greater than 18.",
        starter: "SELECT * FROM users\nWHERE age;",
        testCode: "SELECT * FROM users WHERE age > 18;",
        theory: "WHERE filters rows based on conditions.",
        analogy: "Like sorting through a stack of cards to find specific ones.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "JOIN Tables",
        problem: "Join users with their orders.",
        starter: "SELECT u.name, o.amount\nFROM users u\nJOIN orders o ON u.id = o.user_id;",
        testCode: "SELECT u.name, o.amount FROM users u JOIN orders o ON u.id = o.user_id;",
        theory: "JOIN combines data from multiple tables using a relationship.",
        analogy: "Like merging two lists using a common key to match records.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  rust: {
    id: "rust",
    name: "Rust",
    icon: "ShieldAlert",
    color: "#CE422B",
    category: "Systems Programming",
    description: "Write safe and fast systems code with Rust.",
    floors: [
      {
        number: 1,
        title: "Hello Rust",
        problem: "Print 'Hello, Rust!' using println!().",
        starter: "fn main() {\n    // Your code here\n}\n",
        testCode: "fn main() {\n    println!(\"Hello, Rust!\");\n}\n",
        theory: "println!() is a macro that prints to stdout with a newline.",
        analogy: "Like speaking to the program's console.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Variables & Ownership",
        problem: "Create an immutable variable and print it.",
        starter: "fn main() {\n    // Declare a variable\n}\n",
        testCode: "fn main() {\n    let x = 42;\n    println!(\"{}\", x);\n}\n",
        theory: "Variables in Rust are immutable by default. Use 'mut' to make them mutable.",
        analogy: "Like writing on paper vs. whiteboard.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Functions",
        problem: "Write a function that adds two numbers.",
        starter: "fn add(a: i32, b: i32) -> i32 {\n    // Your code\n}\n",
        testCode: "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n",
        theory: "Rust requires explicit type annotations on function parameters and return types.",
        analogy: "Like specifying exactly what kind of ingredients you need.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  go: {
    id: "go",
    name: "Go",
    icon: "Boxes",
    color: "#00ADD8",
    category: "Systems Programming",
    description: "Build concurrent and efficient applications with Go.",
    floors: [
      {
        number: 1,
        title: "Hello Go",
        problem: "Print 'Hello, Go!' to the console.",
        starter: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Your code here\n}\n",
        testCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Go!\")\n}\n",
        theory: "fmt.Println() prints output. Every Go program has a main() function.",
        analogy: "Like the entry point of a program.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Variables",
        problem: "Declare a variable and print its value.",
        starter: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Declare a variable\n}\n",
        testCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    x := 100\n    fmt.Println(x)\n}\n",
        theory: "Use := for short variable declaration with type inference.",
        analogy: "Like a shorthand notation for creating and assigning variables.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Functions",
        problem: "Write a function that subtracts two numbers.",
        starter: "func subtract(a, b int) int {\n    // Your code\n}\n",
        testCode: "func subtract(a, b int) int {\n    return a - b\n}\n",
        theory: "Go requires explicit return types. Multiple parameters of same type can share the type annotation.",
        analogy: "Like defining a reusable operation with clear input/output.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  c: {
    id: "c",
    name: "C",
    icon: "Grid",
    color: "#A8B9CC",
    category: "Systems Programming",
    description: "Master low-level programming with C.",
    floors: [
      {
        number: 1,
        title: "Hello World",
        problem: "Print 'Hello, World!' to the console.",
        starter: "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}\n",
        testCode: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}\n",
        theory: "printf() outputs formatted text. main() must return 0 on success.",
        analogy: "Like the standard way to communicate output in C.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Variables & Types",
        problem: "Declare an integer and print it.",
        starter: "#include <stdio.h>\n\nint main() {\n    // Declare an integer\n    return 0;\n}\n",
        testCode: "#include <stdio.h>\n\nint main() {\n    int x = 42;\n    printf(\"%d\\n\", x);\n    return 0;\n}\n",
        theory: "C requires explicit type declarations. %d is the format specifier for integers.",
        analogy: "Like telling the compiler exactly what kind of data you're working with.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Functions",
        problem: "Write a function that divides two numbers.",
        starter: "float divide(float a, float b) {\n    // Your code\n}\n",
        testCode: "float divide(float a, float b) {\n    return a / b;\n}\n",
        theory: "Functions in C require return type and parameter types. Use float for decimal values.",
        analogy: "Like defining a mathematical operation with specific input and output types.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  csharp: {
    id: "csharp",
    name: "C#",
    icon: "Network",
    color: "#239120",
    category: "Object-Oriented Programming",
    description: "Build robust applications with C# and .NET.",
    floors: [
      {
        number: 1,
        title: "Hello C#",
        problem: "Print 'Hello, C#!' using Console.WriteLine().",
        starter: "using System;\n\nclass Program {\n    static void Main() {\n        // Your code here\n    }\n}\n",
        testCode: "using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine(\"Hello, C#!\");\n    }\n}\n",
        theory: "Console.WriteLine() outputs text. Using System is required to access Console.",
        analogy: "Like importing a library of useful functions.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Variables",
        problem: "Create a string variable and print it.",
        starter: "using System;\n\nclass Program {\n    static void Main() {\n        // Declare a string\n    }\n}\n",
        testCode: "using System;\n\nclass Program {\n    static void Main() {\n        string name = \"Alice\";\n        Console.WriteLine(name);\n    }\n}\n",
        theory: "String type holds text. C# is strongly typed but supports type inference.",
        analogy: "Like assigning a label to a box of text.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Methods",
        problem: "Write a method that multiplies two integers.",
        starter: "static int Multiply(int a, int b) {\n    // Your code\n}\n",
        testCode: "static int Multiply(int a, int b) {\n    return a * b;\n}\n",
        theory: "Methods are C# functions. Static means they belong to the class, not instances.",
        analogy: "Like class-level utilities that can be called without creating an object.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  kotlin: {
    id: "kotlin",
    name: "Kotlin",
    icon: "Smartphone",
    color: "#7F52FF",
    category: "Modern JVM Programming",
    description: "Write concise and safe code with Kotlin.",
    floors: [
      {
        number: 1,
        title: "Hello Kotlin",
        problem: "Print 'Hello, Kotlin!' to the console.",
        starter: "fun main() {\n    // Your code here\n}\n",
        testCode: "fun main() {\n    println(\"Hello, Kotlin!\")\n}\n",
        theory: "println() is a top-level function. main() is the entry point.",
        analogy: "Like the simplest Kotlin program structure.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Variables",
        problem: "Declare a val (immutable variable) and print it.",
        starter: "fun main() {\n    // Declare a variable\n}\n",
        testCode: "fun main() {\n    val count = 10\n    println(count)\n}\n",
        theory: "val creates immutable variables; var creates mutable ones. Kotlin has strong type inference.",
        analogy: "Like deciding whether something can be changed after creation.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Functions",
        problem: "Write a function that concatenates two strings.",
        starter: "fun greet(first: String, last: String): String {\n    // Your code\n}\n",
        testCode: "fun greet(first: String, last: String): String {\n    return first + \" \" + last\n}\n",
        theory: "Kotlin functions have explicit parameter and return types. String interpolation is also available.",
        analogy: "Like combining pieces of text into a complete sentence.",
        difficulty: "DYNAMICS"
      }
    ]
  },
  bash: {
    id: "bash",
    name: "Bash",
    icon: "Terminal",
    color: "#4EAA25",
    category: "Scripting & Automation",
    description: "Automate tasks and master shell scripting with Bash.",
    floors: [
      {
        number: 1,
        title: "Echo Output",
        problem: "Print 'Hello, Bash!' using the echo command.",
        starter: "#!/bin/bash\n# Your code here\n",
        testCode: "#!/bin/bash\necho \"Hello, Bash!\"\n",
        theory: "echo outputs text. #!/bin/bash is the shebang indicating a Bash script.",
        analogy: "Like telling the shell to print something to the screen.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 2,
        title: "Variables",
        problem: "Create a variable and print its value.",
        starter: "#!/bin/bash\n# Declare a variable\n",
        testCode: "#!/bin/bash\nNAME=\"Charlie\"\necho $NAME\n",
        theory: "Variables are created without var/let. Use $VARIABLE to reference them.",
        analogy: "Like naming storage locations in shell scripts.",
        difficulty: "FOUNDATIONS"
      },
      {
        number: 3,
        title: "Functions",
        problem: "Write a function that adds two numbers.",
        starter: "#!/bin/bash\nfunction add() {\n    # Your code\n}\n",
        testCode: "#!/bin/bash\nfunction add() {\n    echo $((\\$1 + \\$2))\n}\n",
        theory: "Bash functions use $1, $2 for parameters. $((...)) performs arithmetic.",
        analogy: "Like creating reusable shell operations.",
        difficulty: "DYNAMICS"
      }
    ]
  }
};
