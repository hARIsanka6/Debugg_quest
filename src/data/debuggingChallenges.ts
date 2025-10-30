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
  {
    level: 6,
    language: "python",
    title: "Dictionary Key Error",
    description: "Fix the missing key error",
    buggyCode: `student = {"name": "Alice", "age": 20}
print(student["grade"])`,
    correctCode: `student = {"name": "Alice", "age": 20}
print(student.get("grade", "N/A"))`,
    errorMessage: "KeyError: 'grade'",
    hints: [
      "The key 'grade' doesn't exist in the dictionary",
      "Use .get() method with a default value"
    ],
    xpReward: 175,
    difficulty: "medium"
  },
  {
    level: 7,
    language: "python",
    title: "Infinite Loop",
    description: "Fix the loop that never ends",
    buggyCode: `count = 0
while count < 5:
    print(count)`,
    correctCode: `count = 0
while count < 5:
    print(count)
    count += 1`,
    errorMessage: "Program hangs (infinite loop)",
    hints: [
      "The loop condition never becomes false",
      "Increment count inside the loop"
    ],
    xpReward: 200,
    difficulty: "hard"
  },
  {
    level: 8,
    language: "python",
    title: "Import Error",
    description: "Fix the module import issue",
    buggyCode: `from math import squareroot

result = squareroot(16)
print(result)`,
    correctCode: `from math import sqrt

result = sqrt(16)
print(result)`,
    errorMessage: "ImportError: cannot import name 'squareroot'",
    hints: [
      "Check the correct function name in the math module",
      "The function is called 'sqrt', not 'squareroot'"
    ],
    xpReward: 225,
    difficulty: "hard"
  },
  {
    level: 9,
    language: "python",
    title: "Mutable Default Argument",
    description: "Fix the unexpected behavior with default arguments",
    buggyCode: `def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item(1))
print(add_item(2))`,
    correctCode: `def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item(1))
print(add_item(2))`,
    errorMessage: "Prints [1] then [1, 2] instead of [1] then [2]",
    hints: [
      "Mutable default arguments are shared between calls",
      "Use None as default and create a new list inside the function"
    ],
    xpReward: 250,
    difficulty: "hard"
  },
  {
    level: 10,
    language: "python",
    title: "Recursion Depth",
    description: "Fix the stack overflow error",
    buggyCode: `def factorial(n):
    return n * factorial(n - 1)

print(factorial(5))`,
    correctCode: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    errorMessage: "RecursionError: maximum recursion depth exceeded",
    hints: [
      "Recursive functions need a base case to stop",
      "Add a condition to return 1 when n <= 1"
    ],
    xpReward: 300,
    difficulty: "hard"
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
  {
    level: 6,
    language: "javascript",
    title: "Object Property Access",
    description: "Fix the undefined property error",
    buggyCode: `const user = { name: "John", age: 30 };
console.log(user.address.city);`,
    correctCode: `const user = { name: "John", age: 30 };
console.log(user.address?.city || "N/A");`,
    errorMessage: "TypeError: Cannot read property 'city' of undefined",
    hints: [
      "The address property doesn't exist",
      "Use optional chaining (?.) to safely access nested properties"
    ],
    xpReward: 175,
    difficulty: "medium"
  },
  {
    level: 7,
    language: "javascript",
    title: "Array Mutation",
    description: "Fix the unexpected array modification",
    buggyCode: `const original = [1, 2, 3];
const copy = original;
copy.push(4);
console.log(original);`,
    correctCode: `const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original);`,
    errorMessage: "Prints [1, 2, 3, 4] instead of [1, 2, 3]",
    hints: [
      "Assignment creates a reference, not a copy",
      "Use spread operator [...] to create a shallow copy"
    ],
    xpReward: 200,
    difficulty: "hard"
  },
  {
    level: 8,
    language: "javascript",
    title: "This Binding",
    description: "Fix the context loss in callback",
    buggyCode: `const obj = {
    name: "Test",
    greet: function() {
        setTimeout(function() {
            console.log(this.name);
        }, 100);
    }
};

obj.greet();`,
    correctCode: `const obj = {
    name: "Test",
    greet: function() {
        setTimeout(() => {
            console.log(this.name);
        }, 100);
    }
};

obj.greet();`,
    errorMessage: "Prints undefined instead of 'Test'",
    hints: [
      "Regular functions lose 'this' context in callbacks",
      "Use arrow function to preserve 'this' binding"
    ],
    xpReward: 225,
    difficulty: "hard"
  },
  {
    level: 9,
    language: "javascript",
    title: "Floating Point Precision",
    description: "Fix the decimal calculation error",
    buggyCode: `const result = 0.1 + 0.2;
console.log(result === 0.3);`,
    correctCode: `const result = 0.1 + 0.2;
console.log(Math.abs(result - 0.3) < Number.EPSILON);`,
    errorMessage: "Prints false instead of true",
    hints: [
      "Floating point arithmetic has precision issues",
      "Use Number.EPSILON for comparison tolerance"
    ],
    xpReward: 250,
    difficulty: "hard"
  },
  {
    level: 10,
    language: "javascript",
    title: "Closure Memory",
    description: "Fix the memory leak in closure",
    buggyCode: `function createCounter() {
    let count = 0;
    const largeArray = new Array(1000000).fill('data');
    return function() {
        return ++count;
    };
}

const counter = createCounter();`,
    correctCode: `function createCounter() {
    let count = 0;
    return function() {
        return ++count;
    };
}

const counter = createCounter();`,
    errorMessage: "Memory leak: largeArray is retained unnecessarily",
    hints: [
      "Closures keep references to all variables in scope",
      "Remove unused variables from the closure scope"
    ],
    xpReward: 300,
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
  {
    level: 6,
    language: "cpp",
    title: "Vector Out of Range",
    description: "Fix the vector access error",
    buggyCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3};
    cout << nums[5] << endl;
    return 0;
}`,
    correctCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3};
    cout << nums.at(2) << endl;
    return 0;
}`,
    errorMessage: "Undefined behavior: accessing out of bounds",
    hints: [
      "Accessing index 5 in a vector of size 3 is invalid",
      "Use .at() for bounds checking or access valid index"
    ],
    xpReward: 175,
    difficulty: "medium"
  },
  {
    level: 7,
    language: "cpp",
    title: "Dangling Pointer",
    description: "Fix the pointer to local variable",
    buggyCode: `#include <iostream>
using namespace std;

int* getPointer() {
    int x = 10;
    return &x;
}

int main() {
    int* ptr = getPointer();
    cout << *ptr << endl;
    return 0;
}`,
    correctCode: `#include <iostream>
using namespace std;

int* getPointer() {
    int* x = new int(10);
    return x;
}

int main() {
    int* ptr = getPointer();
    cout << *ptr << endl;
    delete ptr;
    return 0;
}`,
    errorMessage: "Undefined behavior: dangling pointer",
    hints: [
      "Cannot return pointer to local variable",
      "Allocate memory dynamically with new"
    ],
    xpReward: 200,
    difficulty: "hard"
  },
  {
    level: 8,
    language: "cpp",
    title: "String Comparison",
    description: "Fix the string comparison error",
    buggyCode: `#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char str1[] = "hello";
    char str2[] = "hello";
    if(str1 == str2) {
        cout << "Equal" << endl;
    }
    return 0;
}`,
    correctCode: `#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char str1[] = "hello";
    char str2[] = "hello";
    if(strcmp(str1, str2) == 0) {
        cout << "Equal" << endl;
    }
    return 0;
}`,
    errorMessage: "Compares pointers instead of string content",
    hints: [
      "== compares memory addresses, not string content",
      "Use strcmp() to compare C-strings"
    ],
    xpReward: 225,
    difficulty: "hard"
  },
  {
    level: 9,
    language: "cpp",
    title: "Integer Overflow",
    description: "Fix the overflow in calculation",
    buggyCode: `#include <iostream>
using namespace std;

int main() {
    int a = 2000000000;
    int b = 2000000000;
    int sum = a + b;
    cout << sum << endl;
    return 0;
}`,
    correctCode: `#include <iostream>
using namespace std;

int main() {
    long long a = 2000000000;
    long long b = 2000000000;
    long long sum = a + b;
    cout << sum << endl;
    return 0;
}`,
    errorMessage: "Integer overflow: negative result",
    hints: [
      "int cannot hold values larger than ~2 billion",
      "Use long long for larger numbers"
    ],
    xpReward: 250,
    difficulty: "hard"
  },
  {
    level: 10,
    language: "cpp",
    title: "Double Delete",
    description: "Fix the double deletion error",
    buggyCode: `#include <iostream>
using namespace std;

int main() {
    int* ptr = new int(42);
    delete ptr;
    delete ptr;
    return 0;
}`,
    correctCode: `#include <iostream>
using namespace std;

int main() {
    int* ptr = new int(42);
    delete ptr;
    ptr = nullptr;
    return 0;
}`,
    errorMessage: "Double free detected: undefined behavior",
    hints: [
      "Deleting the same pointer twice causes errors",
      "Set pointer to nullptr after deletion"
    ],
    xpReward: 300,
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
  },
  {
    level: 6,
    language: "java",
    title: "Concurrent Modification",
    description: "Fix the collection modification error",
    buggyCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1); list.add(2); list.add(3);
        for(Integer num : list) {
            if(num == 2) list.remove(num);
        }
    }
}`,
    correctCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1); list.add(2); list.add(3);
        list.removeIf(num -> num == 2);
    }
}`,
    errorMessage: "ConcurrentModificationException",
    hints: [
      "Cannot modify collection while iterating over it",
      "Use removeIf() method instead"
    ],
    xpReward: 175,
    difficulty: "medium"
  },
  {
    level: 7,
    language: "java",
    title: "Number Format Exception",
    description: "Fix the string to number conversion",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        String text = "123abc";
        int number = Integer.parseInt(text);
        System.out.println(number);
    }
}`,
    correctCode: `public class Main {
    public static void main(String[] args) {
        String text = "123";
        int number = Integer.parseInt(text);
        System.out.println(number);
    }
}`,
    errorMessage: "NumberFormatException: For input string: '123abc'",
    hints: [
      "String must contain only digits to parse as integer",
      "Remove non-numeric characters from the string"
    ],
    xpReward: 200,
    difficulty: "medium"
  },
  {
    level: 8,
    language: "java",
    title: "Stack Overflow",
    description: "Fix the infinite recursion",
    buggyCode: `public class Main {
    public static int fibonacci(int n) {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(5));
    }
}`,
    correctCode: `public class Main {
    public static int fibonacci(int n) {
        if(n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(5));
    }
}`,
    errorMessage: "StackOverflowError",
    hints: [
      "Recursive function needs a base case",
      "Add condition to return when n <= 1"
    ],
    xpReward: 225,
    difficulty: "hard"
  },
  {
    level: 9,
    language: "java",
    title: "Resource Leak",
    description: "Fix the file resource leak",
    buggyCode: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        FileReader reader = new FileReader("test.txt");
        BufferedReader br = new BufferedReader(reader);
        System.out.println(br.readLine());
    }
}`,
    correctCode: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        try(FileReader reader = new FileReader("test.txt");
            BufferedReader br = new BufferedReader(reader)) {
            System.out.println(br.readLine());
        }
    }
}`,
    errorMessage: "Resource leak: reader and br are never closed",
    hints: [
      "File resources must be closed after use",
      "Use try-with-resources statement"
    ],
    xpReward: 250,
    difficulty: "hard"
  },
  {
    level: 10,
    language: "java",
    title: "Equals vs ==",
    description: "Fix the string comparison",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        String s1 = new String("hello");
        String s2 = new String("hello");
        if(s1 == s2) {
            System.out.println("Equal");
        } else {
            System.out.println("Not Equal");
        }
    }
}`,
    correctCode: `public class Main {
    public static void main(String[] args) {
        String s1 = new String("hello");
        String s2 = new String("hello");
        if(s1.equals(s2)) {
            System.out.println("Equal");
        } else {
            System.out.println("Not Equal");
        }
    }
}`,
    errorMessage: "Prints 'Not Equal' instead of 'Equal'",
    hints: [
      "== compares object references, not content",
      "Use .equals() to compare string content"
    ],
    xpReward: 300,
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
