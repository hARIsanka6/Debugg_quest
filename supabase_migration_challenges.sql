-- Create challenges table to store all debugging challenges
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level INTEGER NOT NULL,
    language public.programming_language NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    buggy_code TEXT NOT NULL,
    correct_code TEXT NOT NULL,
    error_message TEXT NOT NULL,
    hints TEXT[] NOT NULL DEFAULT '{}',
    xp_reward INTEGER NOT NULL DEFAULT 50,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(language, level)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_challenges_language_level ON public.challenges(language, level);

-- Enable Row Level Security
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read challenges
CREATE POLICY "Anyone can read challenges" ON public.challenges
    FOR SELECT USING (true);

-- Create policy to allow only authenticated users to insert (for admin purposes)
CREATE POLICY "Authenticated users can insert challenges" ON public.challenges
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert Python challenges
INSERT INTO public.challenges (level, language, title, description, buggy_code, correct_code, error_message, hints, xp_reward, difficulty) VALUES
(1, 'python', 'Missing Colon', 'Fix the syntax error in this simple function', 
'def greet(name)
    return f"Hello, {name}!"

print(greet("World"))', 
'def greet(name):
    return f"Hello, {name}!"

print(greet("World"))', 
'SyntaxError: invalid syntax', 
ARRAY['Python function definitions need a colon at the end', 'Look at the first line - add : after the parenthesis'], 
50, 'easy'),

(2, 'python', 'Indentation Error', 'Fix the indentation in this if statement',
'def check_age(age):
    if age >= 18:
    print("Adult")
    else:
        print("Minor")

check_age(20)',
'def check_age(age):
    if age >= 18:
        print("Adult")
    else:
        print("Minor")

check_age(20)',
'IndentationError: expected an indented block',
ARRAY['Python uses indentation to define code blocks', 'The print statement after if needs proper indentation'],
75, 'easy'),

(3, 'python', 'List Index Error', 'Fix the index out of range error',
'numbers = [1, 2, 3, 4, 5]
for i in range(6):
    print(numbers[i])',
'numbers = [1, 2, 3, 4, 5]
for i in range(5):
    print(numbers[i])',
'IndexError: list index out of range',
ARRAY['The list has 5 elements (indices 0-4)', 'Change range(6) to range(5)'],
100, 'medium'),

(4, 'python', 'Type Error', 'Fix the type mismatch in concatenation',
'age = 25
message = "I am " + age + " years old"
print(message)',
'age = 25
message = "I am " + str(age) + " years old"
print(message)',
'TypeError: can only concatenate str (not int) to str',
ARRAY['You cannot concatenate strings and integers directly', 'Convert the integer to a string using str()'],
125, 'medium'),

(5, 'python', 'Division by Zero', 'Handle the division by zero error',
'def divide(a, b):
    return a / b

result = divide(10, 0)
print(result)',
'def divide(a, b):
    if b == 0:
        return 0
    return a / b

result = divide(10, 0)
print(result)',
'ZeroDivisionError: division by zero',
ARRAY['Check if the divisor is zero before dividing', 'Add an if statement to handle b == 0'],
150, 'medium');

-- Insert JavaScript challenges
INSERT INTO public.challenges (level, language, title, description, buggy_code, correct_code, error_message, hints, xp_reward, difficulty) VALUES
(1, 'javascript', 'Missing Semicolon', 'Fix the syntax error in this function',
'function add(a, b) {
    return a + b
}

const result = add(5, 3)
console.log(result)',
'function add(a, b) {
    return a + b;
}

const result = add(5, 3);
console.log(result);',
'Unexpected token',
ARRAY['JavaScript statements should end with semicolons', 'Add semicolons at the end of each statement'],
50, 'easy'),

(2, 'javascript', 'Undefined Variable', 'Fix the reference error',
'function greet() {
    const message = "Hello";
    console.log(mesage);
}

greet();',
'function greet() {
    const message = "Hello";
    console.log(message);
}

greet();',
'ReferenceError: mesage is not defined',
ARRAY['Check the spelling of variable names', 'Look carefully at the console.log statement - message is misspelled'],
75, 'easy'),

(3, 'javascript', 'Array Method Error', 'Fix the type error in array manipulation',
'const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled.toUpperCase());',
'const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);',
'TypeError: doubled.toUpperCase is not a function',
ARRAY['toUpperCase() is a string method, not an array method', 'Remove the incorrect method call'],
100, 'medium'),

(4, 'javascript', 'Async/Await Error', 'Fix the promise handling',
'function fetchData() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Data"), 1000);
    });
}

const data = fetchData();
console.log(data);',
'async function fetchData() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Data"), 1000);
    });
}

async function main() {
    const data = await fetchData();
    console.log(data);
}

main();',
'Promise { <pending> }',
ARRAY['Promises need to be awaited to get their value', 'Use async/await or .then() to handle the promise'],
125, 'medium'),

(5, 'javascript', 'Scope Error', 'Fix the variable scope issue',
'function counter() {
    for (var i = 0; i < 3; i++) {
        setTimeout(() => console.log(i), 100);
    }
}

counter();',
'function counter() {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => console.log(i), 100);
    }
}

counter();',
'Prints 3, 3, 3 instead of 0, 1, 2',
ARRAY['var has function scope, not block scope', 'Use let instead of var in the for loop'],
150, 'hard');

-- Insert C++ challenges
INSERT INTO public.challenges (level, language, title, description, buggy_code, correct_code, error_message, hints, xp_reward, difficulty) VALUES
(1, 'cpp', 'Missing Semicolon', 'Fix the syntax error',
'#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl
    return 0;
}',
'#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}',
'error: expected '';'' before ''return''',
ARRAY['C++ statements must end with a semicolon', 'Check the cout statement - add ; at the end'],
50, 'easy'),

(2, 'cpp', 'Uninitialized Variable', 'Fix the variable initialization',
'#include <iostream>
using namespace std;

int main() {
    int x;
    int y = 10;
    cout << x + y << endl;
    return 0;
}',
'#include <iostream>
using namespace std;

int main() {
    int x = 0;
    int y = 10;
    cout << x + y << endl;
    return 0;
}',
'warning: ''x'' is used uninitialized',
ARRAY['Variables should be initialized before use', 'Give x an initial value like 0'],
75, 'easy'),

(3, 'cpp', 'Array Bounds', 'Fix the array access error',
'#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for(int i = 0; i <= 5; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}',
'#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for(int i = 0; i < 5; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}',
'runtime error: array index out of bounds',
ARRAY['Array indices go from 0 to size-1', 'Change <= to < in the loop condition'],
100, 'medium'),

(4, 'cpp', 'Pointer Error', 'Fix the null pointer dereference',
'#include <iostream>
using namespace std;

int main() {
    int* ptr = nullptr;
    *ptr = 10;
    cout << *ptr << endl;
    return 0;
}',
'#include <iostream>
using namespace std;

int main() {
    int value = 0;
    int* ptr = &value;
    *ptr = 10;
    cout << *ptr << endl;
    return 0;
}',
'Segmentation fault: dereferencing null pointer',
ARRAY['Cannot dereference a null pointer', 'Initialize ptr to point to a valid memory location'],
125, 'hard'),

(5, 'cpp', 'Memory Leak', 'Fix the memory management issue',
'#include <iostream>
using namespace std;

int main() {
    int* arr = new int[10];
    for(int i = 0; i < 10; i++) {
        arr[i] = i;
    }
    return 0;
}',
'#include <iostream>
using namespace std;

int main() {
    int* arr = new int[10];
    for(int i = 0; i < 10; i++) {
        arr[i] = i;
    }
    delete[] arr;
    return 0;
}',
'Memory leak detected',
ARRAY['Dynamically allocated memory must be freed', 'Use delete[] to free the array before return'],
150, 'hard');

-- Insert Java challenges
INSERT INTO public.challenges (level, language, title, description, buggy_code, correct_code, error_message, hints, xp_reward, difficulty) VALUES
(1, 'java', 'Missing Semicolon', 'Fix the syntax error',
'public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World")
    }
}',
'public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}',
'error: '';'' expected',
ARRAY['Java statements must end with a semicolon', 'Check the println statement - add ; at the end'],
50, 'easy'),

(2, 'java', 'Type Mismatch', 'Fix the type error',
'public class Main {
    public static void main(String[] args) {
        int x = "10";
        System.out.println(x + 5);
    }
}',
'public class Main {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x + 5);
    }
}',
'error: incompatible types: String cannot be converted to int',
ARRAY['Remove the quotes around the number', '10 should be an integer, not a string'],
75, 'easy'),

(3, 'java', 'Null Pointer Exception', 'Fix the null reference error',
'public class Main {
    public static void main(String[] args) {
        String text = null;
        System.out.println(text.length());
    }
}',
'public class Main {
    public static void main(String[] args) {
        String text = "";
        System.out.println(text.length());
    }
}',
'NullPointerException',
ARRAY['Cannot call methods on null objects', 'Initialize text with an empty string instead of null'],
100, 'medium'),

(4, 'java', 'Array Index Exception', 'Fix the array bounds error',
'public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        for(int i = 0; i <= numbers.length; i++) {
            System.out.println(numbers[i]);
        }
    }
}',
'public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        for(int i = 0; i < numbers.length; i++) {
            System.out.println(numbers[i]);
        }
    }
}',
'ArrayIndexOutOfBoundsException',
ARRAY['Array indices go from 0 to length-1', 'Change <= to < in the loop condition'],
125, 'medium'),

(5, 'java', 'Class Cast Exception', 'Fix the type casting error',
'public class Main {
    public static void main(String[] args) {
        Object obj = "Hello";
        Integer num = (Integer) obj;
        System.out.println(num);
    }
}',
'public class Main {
    public static void main(String[] args) {
        Object obj = "Hello";
        String str = (String) obj;
        System.out.println(str);
    }
}',
'ClassCastException: String cannot be cast to Integer',
ARRAY['Cannot cast a String to an Integer', 'Cast to String instead of Integer'],
150, 'hard');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
