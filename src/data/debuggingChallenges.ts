export type DebugChallenge = {
  level: number;
  language: "python" | "javascript" | "cpp" | "java";
  title: string;
  description: string;
  buggyCode: string;
  correctCode: string;
  errorMessage: string;
  hints: string[];
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
};

export const debuggingChallenges: DebugChallenge[] = [
  // Python Challenges
  {
    level: 1,
    language: "python",
    title: "Missing Colon",
    description: "Fix the syntax error in this simple function",
    buggyCode: `def greet(name)
    return f"Hello, {name}!"

print(greet("World"))`,
    correctCode: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
    errorMessage: "SyntaxError: invalid syntax",
    hints: [
      "Python function definitions need something at the end",
      "Look at the first line - what's missing after the parenthesis?"
    ],
    xpReward: 50,
    difficulty: "easy"
  },
  {
    level: 2,
    language: "python",
    title: "Indentation Error",
    description: "Fix the indentation in this if statement",
    buggyCode: `def check_age(age):
    if age >= 18:
    print("Adult")
    else:
        print("Minor")

check_age(20)`,
    correctCode: `def check_age(age):
    if age >= 18:
        print("Adult")
    else:
        print("Minor")

check_age(20)`,
    errorMessage: "IndentationError: expected an indented block",
    hints: [
      "Python uses indentation to define code blocks",
      "The print statement after if needs proper indentation"
    ],
    xpReward: 75,
    difficulty: "easy"
  },
  {
    level: 3,
    language: "python",
    title: "List Index Error",
    description: "Fix the index out of range error",
    buggyCode: `numbers = [1, 2, 3, 4, 5]
for i in range(6):
    print(numbers[i])`,
    correctCode: `numbers = [1, 2, 3, 4, 5]
for i in range(5):
    print(numbers[i])`,
    errorMessage: "IndexError: list index out of range",
    hints: [
      "The list has 5 elements (indices 0-4)",
      "Check the range in the for loop"
    ],
    xpReward: 100,
    difficulty: "medium"
  },
  {
    level: 4,
    language: "python",
    title: "Type Error",
    description: "Fix the type mismatch in concatenation",
    buggyCode: `age = 25
message = "I am " + age + " years old"
print(message)`,
    correctCode: `age = 25
message = "I am " + str(age) + " years old"
print(message)`,
    errorMessage: "TypeError: can only concatenate str (not 'int') to str",
    hints: [
      "You can't concatenate strings and integers directly",
      "Convert the integer to a string using str()"
    ],
    xpReward: 125,
    difficulty: "medium"
  },
  {
    level: 5,
    language: "python",
    title: "Division by Zero",
    description: "Handle the division by zero error",
    buggyCode: `def divide(a, b):
    return a / b

result = divide(10, 0)
print(result)`,
    correctCode: `def divide(a, b):
    if b == 0:
        return 0
    return a / b

result = divide(10, 0)
print(result)`,
    errorMessage: "ZeroDivisionError: division by zero",
    hints: [
      "Check if the divisor is zero before dividing",
      "Add an if statement to handle b == 0"
    ],
    xpReward: 150,
    difficulty: "medium"
  },

  // JavaScript Challenges
  {
    level: 1,
    language: "javascript",
    title: "Missing Semicolon",
    description: "Fix the syntax error in this function",
    buggyCode: `function add(a, b) {
    return a + b
}

const result = add(5, 3)
console.log(result)`,
    correctCode: `function add(a, b) {
    return a + b;
}

const result = add(5, 3);
console.log(result);`,
    errorMessage: "Unexpected token",
    hints: [
      "JavaScript statements should end with semicolons",
      "Add semicolons at the end of each statement"
    ],
    xpReward: 50,
    difficulty: "easy"
  },
  {
    level: 2,
    language: "javascript",
    title: "Undefined Variable",
    description: "Fix the reference error",
    buggyCode: `function greet() {
    const message = "Hello";
    console.log(mesage);
}

greet();`,
    correctCode: `function greet() {
    const message = "Hello";
    console.log(message);
}

greet();`,
    errorMessage: "ReferenceError: mesage is not defined",
    hints: [
      "Check the spelling of variable names",
      "Look carefully at the console.log statement"
    ],
    xpReward: 75,
    difficulty: "easy"
  },
  {
    level: 3,
    language: "javascript",
    title: "Array Method Error",
    description: "Fix the type error in array manipulation",
    buggyCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled.toUpperCase());`,
    correctCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);`,
    errorMessage: "TypeError: doubled.toUpperCase is not a function",
    hints: [
      "toUpperCase() is a string method, not an array method",
      "Remove the incorrect method call"
    ],
    xpReward: 100,
    difficulty: "medium"
  },
  {
    level: 4,
    language: "javascript",
    title: "Async/Await Error",
    description: "Fix the promise handling",
    buggyCode: `function fetchData() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Data"), 1000);
    });
}

const data = fetchData();
console.log(data);`,
    correctCode: `async function fetchData() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Data"), 1000);
    });
}

async function main() {
    const data = await fetchData();
    console.log(data);
}

main();`,
    errorMessage: "Promise { <pending> }",
    hints: [
      "Promises need to be awaited to get their value",
      "Use async/await or .then() to handle the promise"
    ],
    xpReward: 125,
    difficulty: "medium"
  },
  {
    level: 5,
    language: "javascript",
    title: "Scope Error",
    description: "Fix the variable scope issue",
    buggyCode: `function counter() {
    for (var i = 0; i < 3; i++) {
        setTimeout(() => console.log(i), 100);
    }
}

counter();`,
    correctCode: `function counter() {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => console.log(i), 100);
    }
}

counter();`,
    errorMessage: "Prints 3, 3, 3 instead of 0, 1, 2",
    hints: [
      "var has function scope, not block scope",
      "Use let instead of var in the for loop"
    ],
    xpReward: 150,
    difficulty: "hard"
  },

  // C++ Challenges
  {
    level: 1,
    language: "cpp",
    title: "Missing Semicolon",
    description: "Fix the syntax error",
    buggyCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl
    return 0;
}`,
    correctCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
    errorMessage: "error: expected ';' before 'return'",
    hints: [
      "C++ statements must end with a semicolon",
      "Check the cout statement"
    ],
    xpReward: 50,
    difficulty: "easy"
  },
  {
    level: 2,
    language: "cpp",
    title: "Uninitialized Variable",
    description: "Fix the variable initialization",
    buggyCode: `#include <iostream>
using namespace std;

int main() {
    int x;
    int y = 10;
    cout << x + y << endl;
    return 0;
}`,
    correctCode: `#include <iostream>
using namespace std;

int main() {
    int x = 0;
    int y = 10;
    cout << x + y << endl;
    return 0;
}`,
    errorMessage: "warning: 'x' is used uninitialized",
    hints: [
      "Variables should be initialized before use",
      "Give x an initial value"
    ],
    xpReward: 75,
    difficulty: "easy"
  },
  {
    level: 3,
    language: "cpp",
    title: "Array Bounds",
    description: "Fix the array access error",
    buggyCode: `#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for(int i = 0; i <= 5; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}`,
    correctCode: `#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for(int i = 0; i < 5; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}`,
    errorMessage: "runtime error: array index out of bounds",
    hints: [
      "Array indices go from 0 to size-1",
      "Change <= to < in the loop condition"
    ],
    xpReward: 100,
    difficulty: "medium"
  },
  {
    level: 4,
    language: "cpp",
    title: "Pointer Error",
    description: "Fix the null pointer dereference",
    buggyCode: `#include <iostream>
using namespace std;

int main() {
    int* ptr = nullptr;
    *ptr = 10;
    cout << *ptr << endl;
    return 0;
}`,
    correctCode: `#include <iostream>
using namespace std;

int main() {
    int value = 0;
    int* ptr = &value;
    *ptr = 10;
    cout << *ptr << endl;
    return 0;
}`,
    errorMessage: "Segmentation fault: dereferencing null pointer",
    hints: [
      "Cannot dereference a null pointer",
      "Initialize ptr to point to a valid memory location"
    ],
    xpReward: 125,
    difficulty: "hard"
  },
  {
    level: 5,
    language: "cpp",
    title: "Memory Leak",
    description: "Fix the memory management issue",
    buggyCode: `#include <iostream>
using namespace std;

int main() {
    int* arr = new int[10];
    for(int i = 0; i < 10; i++) {
        arr[i] = i;
    }
    return 0;
}`,
    correctCode: `#include <iostream>
using namespace std;

int main() {
    int* arr = new int[10];
    for(int i = 0; i < 10; i++) {
        arr[i] = i;
    }
    delete[] arr;
    return 0;
}`,
    errorMessage: "Memory leak detected",
    hints: [
      "Dynamically allocated memory must be freed",
      "Use delete[] to free the array"
    ],
    xpReward: 150,
    difficulty: "hard"
  },

  // Java Challenges
  {
    level: 1,
    language: "java",
    title: "Missing Semicolon",
    description: "Fix the syntax error",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World")
    }
}`,
    correctCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    errorMessage: "error: ';' expected",
    hints: [
      "Java statements must end with a semicolon",
      "Check the println statement"
    ],
    xpReward: 50,
    difficulty: "easy"
  },
  {
    level: 2,
    language: "java",
    title: "Type Mismatch",
    description: "Fix the type error",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        int x = "10";
        System.out.println(x + 5);
    }
}`,
    correctCode: `public class Main {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x + 5);
    }
}`,
    errorMessage: "error: incompatible types: String cannot be converted to int",
    hints: [
      "Remove the quotes around the number",
      "10 should be an integer, not a string"
    ],
    xpReward: 75,
    difficulty: "easy"
  },
  {
    level: 3,
    language: "java",
    title: "Null Pointer Exception",
    description: "Fix the null reference error",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        String text = null;
        System.out.println(text.length());
    }
}`,
    correctCode: `public class Main {
    public static void main(String[] args) {
        String text = "";
        System.out.println(text.length());
    }
}`,
    errorMessage: "NullPointerException",
    hints: [
      "Cannot call methods on null objects",
      "Initialize text with an empty string instead of null"
    ],
    xpReward: 100,
    difficulty: "medium"
  },
  {
    level: 4,
    language: "java",
    title: "Array Index Exception",
    description: "Fix the array bounds error",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        for(int i = 0; i <= numbers.length; i++) {
            System.out.println(numbers[i]);
        }
    }
}`,
    correctCode: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        for(int i = 0; i < numbers.length; i++) {
            System.out.println(numbers[i]);
        }
    }
}`,
    errorMessage: "ArrayIndexOutOfBoundsException",
    hints: [
      "Array indices go from 0 to length-1",
      "Change <= to < in the loop condition"
    ],
    xpReward: 125,
    difficulty: "medium"
  },
  {
    level: 5,
    language: "java",
    title: "Class Cast Exception",
    description: "Fix the type casting error",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        Object obj = "Hello";
        Integer num = (Integer) obj;
        System.out.println(num);
    }
}`,
    correctCode: `public class Main {
    public static void main(String[] args) {
        Object obj = "Hello";
        String str = (String) obj;
        System.out.println(str);
    }
}`,
    errorMessage: "ClassCastException: String cannot be cast to Integer",
    hints: [
      "Cannot cast a String to an Integer",
      "Cast to String instead of Integer"
    ],
    xpReward: 150,
    difficulty: "hard"
  }
];

export const getChallengeByLanguageAndLevel = (
  language: string,
  level: number
): DebugChallenge | undefined => {
  return debuggingChallenges.find(
    (c) => c.language === language && c.level === level
  );
};
