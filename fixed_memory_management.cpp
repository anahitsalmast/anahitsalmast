#include <iostream>
#include <string>
#include <vector>
#include <cstring>
#include <memory>
#include <mutex>
#include <stdexcept>
#include <algorithm>
#include <unordered_map>

// Fixed: Proper RAII with destructor and bounds checking
class ResourceManager {
private:
    std::unique_ptr<int[]> data;
    size_t size;
    
public:
    ResourceManager(size_t size) : size(size) {
        if (size == 0) {
            throw std::invalid_argument("Size must be greater than 0");
        }
        data = std::make_unique<int[]>(size);
    }
    
    // Fixed: Rule of Five implementation
    ResourceManager(const ResourceManager& other) : size(other.size) {
        data = std::make_unique<int[]>(size);
        std::copy(other.data.get(), other.data.get() + size, data.get());
    }
    
    ResourceManager& operator=(const ResourceManager& other) {
        if (this != &other) {
            size = other.size;
            data = std::make_unique<int[]>(size);
            std::copy(other.data.get(), other.data.get() + size, data.get());
        }
        return *this;
    }
    
    ResourceManager(ResourceManager&& other) noexcept 
        : data(std::move(other.data)), size(other.size) {
        other.size = 0;
    }
    
    ResourceManager& operator=(ResourceManager&& other) noexcept {
        if (this != &other) {
            data = std::move(other.data);
            size = other.size;
            other.size = 0;
        }
        return *this;
    }
    
    // Fixed: Destructor automatically called due to RAII with unique_ptr
    ~ResourceManager() = default;
    
    void setData(size_t index, int value) {
        // Fixed: Bounds checking
        if (index >= size) {
            throw std::out_of_range("Index out of bounds");
        }
        data[index] = value;
    }
    
    int getData(size_t index) const {
        // Fixed: Bounds checking
        if (index >= size) {
            throw std::out_of_range("Index out of bounds");
        }
        return data[index];
    }
    
    size_t getSize() const { return size; }
};

// Fixed: Safe string copying with bounds checking
void copyString(const char* source) {
    if (!source) {
        std::cerr << "Error: Source string is null" << std::endl;
        return;
    }
    
    const size_t BUFFER_SIZE = 10;
    char buffer[BUFFER_SIZE];
    
    // Fixed: Use safe string copy with length limit
    size_t sourceLen = strlen(source);
    if (sourceLen >= BUFFER_SIZE) {
        std::cerr << "Warning: String truncated" << std::endl;
        strncpy(buffer, source, BUFFER_SIZE - 1);
        buffer[BUFFER_SIZE - 1] = '\0';  // Ensure null termination
    } else {
        strcpy(buffer, source);
    }
    
    std::cout << "Copied: " << buffer << std::endl;
}

// Fixed: Better approach using std::string
void copyStringSafe(const std::string& source) {
    const size_t MAX_LENGTH = 9;  // Reserve space for null terminator
    
    std::string result = source;
    if (source.length() > MAX_LENGTH) {
        result = source.substr(0, MAX_LENGTH);
        std::cout << "Warning: String truncated" << std::endl;
    }
    
    std::cout << "Copied: " << result << std::endl;
}

// Fixed: Demonstrate proper memory management
void demonstrateProperMemoryManagement() {
    // Fixed: Use RAII and smart pointers
    std::unique_ptr<int> ptr = std::make_unique<int>(42);
    
    std::cout << "Value: " << *ptr << std::endl;
    
    // Fixed: No explicit delete needed, automatic cleanup
    // Smart pointer automatically handles deallocation
}

// Fixed: Return value instead of pointer to local variable
int createValue() {
    int localVar = 123;
    return localVar;  // Fixed: Return by value, not by reference/pointer
}

// Alternative: Use dynamic allocation with smart pointer
std::unique_ptr<int> createDynamicValue() {
    return std::make_unique<int>(123);
}

// Fixed: Proper bounds checking
void arrayBoundsCheck() {
    const int SIZE = 5;
    int arr[SIZE] = {1, 2, 3, 4, 5};
    
    // Fixed: Correct loop condition
    for (int i = 0; i < SIZE; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

// Better: Use std::array with range-based for loop
void arrayBoundsCheckModern() {
    std::array<int, 5> arr = {1, 2, 3, 4, 5};
    
    // Fixed: Range-based for loop eliminates bounds issues
    for (const auto& element : arr) {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}

// Fixed: Proper copy constructor and assignment operator
class SafeCopyClass {
private:
    std::unique_ptr<int[]> data;
    size_t size;
    
public:
    SafeCopyClass(size_t s) : size(s) {
        data = std::make_unique<int[]>(size);
        for (size_t i = 0; i < size; i++) {
            data[i] = static_cast<int>(i);
        }
    }
    
    // Fixed: Proper copy constructor (deep copy)
    SafeCopyClass(const SafeCopyClass& other) : size(other.size) {
        data = std::make_unique<int[]>(size);
        std::copy(other.data.get(), other.data.get() + size, data.get());
    }
    
    // Fixed: Proper assignment operator
    SafeCopyClass& operator=(const SafeCopyClass& other) {
        if (this != &other) {
            size = other.size;
            data = std::make_unique<int[]>(size);
            std::copy(other.data.get(), other.data.get() + size, data.get());
        }
        return *this;
    }
    
    // Move constructor and assignment
    SafeCopyClass(SafeCopyClass&& other) noexcept 
        : data(std::move(other.data)), size(other.size) {
        other.size = 0;
    }
    
    SafeCopyClass& operator=(SafeCopyClass&& other) noexcept {
        if (this != &other) {
            data = std::move(other.data);
            size = other.size;
            other.size = 0;
        }
        return *this;
    }
    
    ~SafeCopyClass() = default;  // Smart pointer handles cleanup
    
    void print() const {
        for (size_t i = 0; i < size; i++) {
            std::cout << data[i] << " ";
        }
        std::cout << std::endl;
    }
};

// Fixed: Memoized fibonacci to avoid exponential time
class FibonacciCalculator {
private:
    mutable std::unordered_map<int, long long> cache;
    
public:
    long long fibonacci(int n) const {
        if (n < 0) {
            throw std::invalid_argument("Fibonacci not defined for negative numbers");
        }
        
        if (n <= 1) {
            return n;
        }
        
        // Check cache first
        auto it = cache.find(n);
        if (it != cache.end()) {
            return it->second;
        }
        
        // Calculate and cache result
        long long result = fibonacci(n - 1) + fibonacci(n - 2);
        cache[n] = result;
        return result;
    }
};

// Alternative: Iterative fibonacci
long long fibonacciIterative(int n) {
    if (n < 0) {
        throw std::invalid_argument("Fibonacci not defined for negative numbers");
    }
    
    if (n <= 1) return n;
    
    long long prev = 0, curr = 1;
    for (int i = 2; i <= n; i++) {
        long long next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

// Fixed: Thread-safe counter
class ThreadSafeCounter {
private:
    int count = 0;
    mutable std::mutex mtx;
    
public:
    void increment() {
        std::lock_guard<std::mutex> lock(mtx);
        count++;
    }
    
    int getCount() const {
        std::lock_guard<std::mutex> lock(mtx);
        return count;
    }
    
    void reset() {
        std::lock_guard<std::mutex> lock(mtx);
        count = 0;
    }
};

// Fixed: Better memory layout
struct GoodAlignment {
    int i;      // 4 bytes
    char c;     // 1 byte
    char c2;    // 1 byte
    // 2 bytes padding to align to 4-byte boundary
    // Total: 8 bytes (instead of 12 with bad alignment)
};

// Even better: Group similar types together
struct OptimalAlignment {
    int i;      // 4 bytes
    char c;     // 1 byte  
    char c2;    // 1 byte
    short s;    // 2 bytes - total 8 bytes, no padding needed
};

// Fixed: Use size_t for container sizes
void fixedSignedUnsigned(const std::vector<int>& vec) {
    // Fixed: Use size_t for loop variable to match vector::size() return type
    for (size_t i = 0; i < vec.size(); i++) {
        std::cout << vec[i] << " ";
    }
    std::cout << std::endl;
}

// Better: Use range-based for loop
void modernIteration(const std::vector<int>& vec) {
    for (const auto& element : vec) {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}

// Even better: Use iterators
void iteratorBased(const std::vector<int>& vec) {
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;
}

int main() {
    std::cout << "Fixed C++ code - all memory issues addressed" << std::endl;
    
    try {
        // Demonstrate fixed ResourceManager
        ResourceManager rm(5);
        rm.setData(0, 100);
        std::cout << "ResourceManager working correctly: " << rm.getData(0) << std::endl;
        
        // Demonstrate safe string copying
        copyStringSafe("Hello, World!");
        
        // Demonstrate proper memory management
        demonstrateProperMemoryManagement();
        
        // Demonstrate fixed array bounds
        arrayBoundsCheckModern();
        
        // Demonstrate fibonacci with memoization
        FibonacciCalculator fibCalc;
        std::cout << "Fibonacci(10) = " << fibCalc.fibonacci(10) << std::endl;
        
        // Demonstrate thread-safe counter
        ThreadSafeCounter counter;
        counter.increment();
        std::cout << "Counter value: " << counter.getCount() << std::endl;
        
        // Demonstrate fixed iteration
        std::vector<int> testVec = {1, 2, 3, 4, 5};
        modernIteration(testVec);
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    
    return 0;
}