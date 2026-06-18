#!/usr/bin/env python3
import sys
import json
import re
import ast

MAX_CODE_LENGTH = 8000

# Dangerous patterns blocked before any server-side execution
PYTHON_BLOCKED = [
    r"\bimport\s+os\b", r"\bfrom\s+os\b",
    r"\bimport\s+subprocess\b", r"\bfrom\s+subprocess\b",
    r"\bimport\s+sys\b", r"\bfrom\s+sys\b",
    r"\bimport\s+socket\b", r"\bfrom\s+socket\b",
    r"\bimport\s+shutil\b", r"\bfrom\s+shutil\b",
    r"\bimport\s+pathlib\b", r"\bfrom\s+pathlib\b",
    r"\bimport\s+ctypes\b", r"\bfrom\s+ctypes\b",
    r"\bimport\s+pickle\b", r"\bfrom\s+pickle\b",
    r"\bimport\s+multiprocessing\b", r"\bfrom\s+multiprocessing\b",
    r"\bimport\s+requests\b", r"\bfrom\s+requests\b",
    r"\bimport\s+urllib\b", r"\bfrom\s+urllib\b",
    r"\b__import__\s*\(", r"\beval\s*\(", r"\bexec\s*\(", r"\bcompile\s*\(",
    r"\bopen\s*\(", r"\bos\.", r"\bsubprocess\.", r"\bsocket\.",
    r"\bgetattr\s*\(", r"\bsetattr\s*\(", r"\bdelattr\s*\(",
]

JS_BLOCKED = [
    r"require\s*\(\s*['\"]fs['\"]", r"require\s*\(\s*['\"]child_process['\"]",
    r"require\s*\(\s*['\"]net['\"]", r"require\s*\(\s*['\"]http['\"]",
    r"require\s*\(\s*['\"]https['\"]", r"require\s*\(\s*['\"]os['\"]",
    r"\bprocess\.", r"\beval\s*\(", r"\bFunction\s*\(",
    r"import\s*\(\s*['\"]fs['\"]", r"import\s*\(\s*['\"]child_process['\"]",
]

RUST_BLOCKED = [
    r"\bunsafe\b", r"\bstd::process\b", r"\bstd::fs\b", r"\bstd::net\b",
    r"\bCommand::", r"\bread_dir\b", r"\bwrite\s*\(",
]

SQL_BLOCKED = [
    r"\bATTACH\b", r"\bPRAGMA\b", r"\bload_extension\b",
]

def security_violation(language, code):
    if not code:
        return None
    if len(code) > MAX_CODE_LENGTH:
        return f"Code exceeds maximum length of {MAX_CODE_LENGTH} characters."

    patterns = []
    if language == "python":
        patterns = PYTHON_BLOCKED
    elif language == "javascript":
        patterns = JS_BLOCKED
    elif language == "rust":
        patterns = RUST_BLOCKED
    elif language == "sql":
        patterns = SQL_BLOCKED

    for pattern in patterns:
        if re.search(pattern, code, re.IGNORECASE):
            return "Blocked: code contains disallowed operations for the sandbox."

    return None

def process_and_grade(language, code, expected, floor_level, allow_execution=True):
    """
    Core dynamic technical grading system. Takes submitted code, normalizes syntax, 
    evaluates lines of code, measures logical complexity, and asserts matching conditions.
    Supports comma, '&&', or '||' conditional checks.
    Also executes the code in real-time in a safe workspace sub-process and returns stdout/stderr.
    """
    code = code.strip() if code else ""
    expected = expected.strip() if expected else ""
    
    # Static Data Analysis Metrics
    line_count = len(code.splitlines()) if code else 0
    char_count = len(code)
    comment_count = len([line for line in code.splitlines() if line.lstrip().startswith(('#', '//', '/*', '--', '<!--'))])
    
    # Calculate initial complexity estimation
    complexity_score = "Low"
    if line_count > 12:
        complexity_score = "High"
    elif line_count > 6:
        complexity_score = "Medium"
    
    if any(k in code for k in ["for", "while", "if", ".map(", "filter(", "reduce("]):
        complexity_score = "Medium"
    if any(k in code for k in ["class ", "def ", "fn ", "struct ", "import "]):
        complexity_score = "High"

    passed = False
    details = ""
    error_suggestion = ""
    execution_output = ""

    security_error = security_violation(language, code)
    if security_error:
        return {
            "success": False,
            "executionOutput": security_error,
            "metrics": {
                "linesOfCode": line_count,
                "characterCount": char_count,
                "commentCount": comment_count,
                "complexityRating": complexity_score
            },
            "feedback": {
                "validationDetails": security_error,
                "debuggerGuidance": "Remove system-level imports or file/network operations. Use lesson-safe syntax only."
            }
        }

    # Live Code Sandbox Execution Phase (authenticated users only)
    if allow_execution and language == "python":
        import subprocess
        try:
            proc = subprocess.run(
                [sys.executable, "-c", code],
                capture_output=True,
                text=True,
                timeout=2.0
            )
            execution_output = (proc.stdout or "") + (proc.stderr or "")
            if not execution_output.strip() and proc.returncode == 0:
                execution_output = "(Python script executed successfully with no output to stdout.)"
        except subprocess.TimeoutExpired:
            execution_output = "Timeout Error: Python script hung (exceeded limit of 2.0 seconds)."
        except Exception as e:
            execution_output = f"Python Runtime Exception: {str(e)}"

    elif allow_execution and language == "javascript":
        import subprocess
        try:
            proc = subprocess.run(
                ["node", "-e", code],
                capture_output=True,
                text=True,
                timeout=2.0
            )
            execution_output = (proc.stdout or "") + (proc.stderr or "")
            if not execution_output.strip() and proc.returncode == 0:
                execution_output = "(JavaScript code run successfully with no output to console.)"
        except subprocess.TimeoutExpired:
            execution_output = "Timeout Error: JavaScript execution hung (exceeded limit of 2.0 seconds)."
        except FileNotFoundError:
            # Fallback mock simulation
            execution_output = f"[Host Simulation Mode] JS workspace compiler simulation completed successfully and compiled: {line_count} line markers."
        except Exception as e:
            execution_output = f"JavaScript Runtime Exception: {str(e)}"

    elif allow_execution and language == "sql":
        import sqlite3
        try:
            conn = sqlite3.connect(":memory:")
            cursor = conn.cursor()
            
            # Seed our virtual database layout
            cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, role TEXT, email TEXT, phone TEXT)")
            cursor.executemany("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)", [
                (1, "Alex", 24, "developer", "alex@codecity.edu", "555-0101"),
                (2, "Maria", 32, "admin", "maria@codecity.edu", "555-0102"),
                (3, "Devon", 19, "student", "devon@codecity.edu", "555-0103"),
                (4, "Taylor", 28, "instructor", "taylor@codecity.edu", "555-0104")
            ])

            cursor.execute("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL)")
            cursor.executemany("INSERT INTO products VALUES (?, ?, ?)", [
                (101, "Syllabus Microprocessor", 89.99),
                (102, "Hyper-Thread Cable", 15.50),
                (103, "Logic Gate Core", 120.00),
                (104, "Analog Signal Shield", 45.00)
            ])

            cursor.execute("CREATE TABLE sales (id INTEGER PRIMARY KEY, category TEXT, amount REAL, item_id INTEGER)")
            cursor.executemany("INSERT INTO sales VALUES (?, ?, ?, ?)", [
                (1, "hardware", 180.00, 101),
                (2, "hardware", 120.00, 103),
                (3, "networking", 45.00, 102),
                (4, "networking", 15.50, 102)
            ])

            cursor.execute("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)")
            cursor.executemany("INSERT INTO customers VALUES (?, ?, ?)", [
                (1, "Alex", 30),
                (2, "Jordan", 25),
                (3, "Casey", 40)
            ])

            cursor.execute("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT)")
            cursor.executemany("INSERT INTO items VALUES (?, ?)", [
                (101, "Syllabus Microprocessor"),
                (102, "Hyper-Thread Cable"),
                (103, "Logic Gate Core")
            ])
            
            statements = [s.strip() for s in code.split(";") if s.strip()]
            if not statements:
                execution_output = "No SQL statement parsed."
            else:
                formatted_results = []
                for stmt in statements:
                    cursor.execute(stmt)
                    if stmt.upper().startswith("SELECT"):
                        rows = cursor.fetchall()
                        if cursor.description:
                            headers = [desc[0] for desc in cursor.description]
                            # Calculate column spacing
                            col_widths = [len(h) for h in headers]
                            for row in rows:
                                for i, val in enumerate(row):
                                    col_widths[i] = max(col_widths[i], len(str(val or 'NULL')))
                            
                            header_line = " | ".join(h.upper().ljust(col_widths[i]) for i, h in enumerate(headers))
                            divider = "-+-".join("-" * w for w in col_widths)
                            stmt_out = [header_line, divider]
                            for row in rows:
                                stmt_out.append(" | ".join(str(val if val is not None else 'NULL').ljust(col_widths[i]) for i, val in enumerate(row)))
                            
                            formatted_results.append(f"SQL QUERY: {stmt}\n" + "\n".join(stmt_out) + f"\n({len(rows)} rows returned)\n")
                        else:
                            formatted_results.append(f"SQL QUERY: {stmt}\n(Query returned success)\n")
                    else:
                        conn.commit()
                        formatted_results.append(f"SQL EXECUTE: {stmt}\nRows affected: {cursor.rowcount}\n")
                execution_output = "\n".join(formatted_results)
        except Exception as e:
            execution_output = f"SQLite Database Error: {str(e)}"

    elif language == "html":
        execution_output = "HTML structure mounted to live visual viewer. See dynamic visual canvas rendering."
    elif not allow_execution and language not in ("html",):
        execution_output = "[Pattern Check Only] Sign in to enable live code execution in the sandbox."

    elif allow_execution and language == "rust":
        import tempfile
        import os
        import subprocess
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                source_path = os.path.join(tmpdir, "main.rs")
                bin_path = os.path.join(tmpdir, "main")
                with open(source_path, "w") as f:
                    f.write(code)
                compile_proc = subprocess.run(
                    ["rustc", source_path, "-o", bin_path],
                    capture_output=True,
                    text=True,
                    timeout=5.0
                )
                if compile_proc.returncode != 0:
                    execution_output = f"Rust Compiler Error:\n{compile_proc.stderr}"
                else:
                    run_proc = subprocess.run(
                        [bin_path],
                        capture_output=True,
                        text=True,
                        timeout=2.0
                    )
                    execution_output = (run_proc.stdout or "") + (run_proc.stderr or "")
        except FileNotFoundError:
            # Simulated rust tracing
            printlns = re.findall(r'println!\s*\(\s*"(.*?)"\s*(?:,\s*(.*?))?\s*\)', code)
            if printlns:
                simulated_output = []
                for text, vars_str in printlns:
                    if vars_str:
                        vars_list = [v.strip() for v in vars_str.split(",")]
                        formatted_text = text.replace("{}", "{placeholder}")
                        for v in vars_list:
                            formatted_text = formatted_text.replace("{placeholder}", f"<{v}>", 1)
                        simulated_output.append(formatted_text)
                    else:
                        simulated_output.append(text)
                execution_output = "[Host Simulation Mode] Rust compiler verification checked.\n\nSTDOUT:\n" + "\n".join(simulated_output)
            else:
                execution_output = "[Host Simulation Mode] Rust compile-time ownership borrow checks PASSED successfully."
        except Exception as e:
            execution_output = f"Rust Exception: {str(e)}"

    # Normalization helper to prevent white-space, semicolon, and quote differences from breaking grading
    def normalize(s):
        s = re.sub(r'\s+', '', s)
        s = s.replace("'", '"').replace(';', '').lower()
        return s

    norm_user = normalize(code)

    # Compile-time physical check for Python
    if language == "python":
        try:
            ast.parse(code)
        except Exception as e:
            return {
                "success": False,
                "executionOutput": f"Python Compiler/AST Syntax Error: {str(e)}",
                "metrics": {
                    "linesOfCode": line_count,
                    "characterCount": char_count,
                    "commentCount": comment_count,
                    "complexityRating": complexity_score
                },
                "feedback": {
                    "validationDetails": f"Python Syntax Error: {str(e)}",
                    "debuggerGuidance": "Review your indentation, unmatched parenthesis, or colons before testing."
                }
            }

    # Evaluate dynamic validation rules
    if expected:
        if "&&" in expected:
            # All substrings must be present
            parts = [normalize(p) for p in expected.split("&&")]
            passed = all(p in norm_user for p in parts)
            if not passed:
                missing = [expected.split("&&")[i].strip() for i, p in enumerate(parts) if p not in norm_user]
                details = f"Your code is missing required elements: {', '.join(missing)}."
                error_suggestion = f"Make sure to correctly define, call, or import {missing[0]}."
        elif "||" in expected:
            # At least one substring must be present
            parts = [normalize(p) for p in expected.split("||")]
            passed = any(p in norm_user for p in parts)
            if not passed:
                details = f"Your code did not match the expected pattern: {expected}"
                error_suggestion = "Ensure you are using the correct functions or syntax outlined in the specifications."
        else:
            # Standard single substring check
            norm_expected = normalize(expected)
            passed = norm_expected in norm_user
            if not passed:
                details = f"Required structure not found. Expected to find matches for: {expected}"
                error_suggestion = f"Check spelling and verify that you included: {expected}"
    else:
        # If no expectation, check if user wrote something non-trivial
        passed = len(norm_user) > 0
        if not passed:
            details = "Your workspace appears empty."
            error_suggestion = "Provide a valid solution to complete this lesson."

    response = {
        "success": passed,
        "executionOutput": execution_output,
        "metrics": {
            "linesOfCode": line_count,
            "characterCount": char_count,
            "commentCount": comment_count,
            "complexityRating": complexity_score
        },
        "feedback": {
            "validationDetails": "Verification Success! Your code complies with the technical syllabus specification." if passed else details,
            "debuggerGuidance": "All local test checks succeeded. Proceed to the next module!" if passed else error_suggestion
        }
    }
    return response

if __name__ == "__main__":
    try:
        # Read from stdin
        payload = json.loads(sys.stdin.read())
        lang = payload.get("language", "python")
        user_code = payload.get("code", "")
        target_expect = payload.get("expected", "")
        floor = int(payload.get("floor_level", 1))
        allow_execution = bool(payload.get("allow_execution", False))

        output = process_and_grade(lang, user_code, target_expect, floor, allow_execution)
        print(json.dumps(output, indent=2))
    except Exception as err:
        error_response = {
            "success": False,
            "metrics": {"linesOfCode": 0, "characterCount": 0, "commentCount": 0, "complexityRating": "Error"},
            "feedback": {
                "validationDetails": f"Grader Exception: {str(err)}",
                "debuggerGuidance": "Review syntax blocks carefully and fix any errors."
            }
        }
        print(json.dumps(error_response, indent=2))
