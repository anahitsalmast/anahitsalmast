/**
 * Fixed JavaScript algorithms with bugs addressed
 */

// Fixed: Correct binary search implementation
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1; // Fixed: Correct upper bound
    
    while (left <= right) { // Fixed: Correct condition
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

// Fixed: Efficient O(n²) triplet finding algorithm
function findTriplets(arr, sum) {
    const result = [];
    arr.sort((a, b) => a - b); // Sort for two-pointer technique
    
    for (let i = 0; i < arr.length - 2; i++) {
        // Skip duplicate values for first element
        if (i > 0 && arr[i] === arr[i - 1]) continue;
        
        let left = i + 1;
        let right = arr.length - 1;
        
        while (left < right) {
            const currentSum = arr[i] + arr[left] + arr[right];
            
            if (currentSum === sum) {
                result.push([arr[i], arr[left], arr[right]]);
                
                // Skip duplicates
                while (left < right && arr[left] === arr[left + 1]) left++;
                while (left < right && arr[right] === arr[right - 1]) right--;
                
                left++;
                right--;
            } else if (currentSum < sum) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}

// Fixed: Avoid circular references with WeakMap for cleanup
function createSafeObjectStructure() {
    const obj1 = { id: 1, data: "object1" };
    const obj2 = { id: 2, data: "object2" };
    
    // Use WeakMap to avoid circular references
    const relationships = new WeakMap();
    relationships.set(obj1, obj2);
    relationships.set(obj2, obj1);
    
    return { obj1, obj2, getRelation: (obj) => relationships.get(obj) };
}

// Fixed: Correct palindrome check with proper character handling
function isPalindrome(str) {
    // Remove non-alphanumeric characters and convert to lowercase
    const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let left = 0;
    let right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// Fixed: Proper async processing with Promise.all
async function processItems(items) {
    // Fixed: Use Promise.all to properly wait for all async operations
    const promises = items.map(item => processItem(item));
    const results = await Promise.all(promises);
    return results;
}

// Alternative: Sequential processing if order matters
async function processItemsSequential(items) {
    const results = [];
    for (const item of items) {
        const processed = await processItem(item);
        results.push(processed);
    }
    return results;
}

// Mock async function for demonstration
function processItem(item) {
    return new Promise(resolve => {
        setTimeout(() => resolve(item * 2), Math.random() * 100);
    });
}

// Fixed: Safe object merging with prototype pollution protection
function safeMerge(target, source) {
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    
    for (let key in source) {
        // Fixed: Check for dangerous keys
        if (dangerousKeys.includes(key)) {
            continue;
        }
        
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                safeMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// Fixed: Iterative factorial with overflow protection
function factorial(n) {
    // Fixed: Input validation
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;
    
    // Fixed: Check for numbers that would cause overflow
    if (n > 170) {
        throw new Error('Number too large - would cause overflow');
    }
    
    // Fixed: Iterative approach to avoid stack overflow
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Alternative: Memoized recursive version for efficiency
const fibonacciMemoized = (() => {
    const cache = new Map();
    
    function fib(n) {
        if (n < 0) return undefined;
        if (n <= 1) return n;
        
        if (cache.has(n)) {
            return cache.get(n);
        }
        
        const result = fib(n - 1) + fib(n - 2);
        cache.set(n, result);
        return result;
    }
    
    return fib;
})();

// Fixed: Numeric sorting
function sortNumbers(numbers) {
    // Fixed: Use numeric comparison function
    return [...numbers].sort((a, b) => a - b);
}

// Fixed: Efficient string building
function buildLargeString(n) {
    // Fixed: Use array join for efficient string concatenation
    return new Array(n).fill('x').join('');
}

// Alternative: Use repeat method for simple repetition
function buildLargeStringSimple(n) {
    return 'x'.repeat(n);
}

// Fixed: Proper error handling for division
function divide(a, b) {
    // Fixed: Input validation
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Both arguments must be numbers');
    }
    
    // Fixed: Check for division by zero
    if (b === 0) {
        throw new Error('Division by zero is not allowed');
    }
    
    return a / b;
}

// Safe division that returns null instead of throwing
function safeDivide(a, b) {
    try {
        return divide(a, b);
    } catch (error) {
        console.warn('Division error:', error.message);
        return null;
    }
}

module.exports = {
    binarySearch,
    findTriplets,
    createSafeObjectStructure,
    isPalindrome,
    processItems,
    processItemsSequential,
    safeMerge,
    factorial,
    fibonacciMemoized,
    sortNumbers,
    buildLargeString,
    buildLargeStringSimple,
    divide,
    safeDivide
};