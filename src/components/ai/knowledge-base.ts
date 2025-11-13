// Advanced AI Knowledge Base - GPT-5 Level Training Data

interface ConversationContext {
  previousTopics: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  currentSubject?: string;
}

// Advanced pattern matching and response generation
export class AIKnowledgeBase {
  private context: ConversationContext = {
    previousTopics: [],
    userLevel: 'intermediate'
  };

  updateContext(topic: string, userMessage: string) {
    this.context.previousTopics.push(topic);
    if (this.context.previousTopics.length > 5) {
      this.context.previousTopics.shift();
    }
    
    // Detect user level from language complexity
    const complexWords = ['however', 'furthermore', 'nevertheless', 'consequently'];
    const hasComplex = complexWords.some(word => userMessage.toLowerCase().includes(word));
    if (hasComplex) {
      this.context.userLevel = 'advanced';
    }
  }

  // Mathematics responses with deep understanding
  getMathResponse(question: string): string | null {
    const q = question.toLowerCase();
    
    // Quadratic equations
    if (q.includes('quadratic') || (q.includes('equation') && q.includes('x^2'))) {
      return `📐 **Quadratic Equations - Complete Guide**

A quadratic equation has the form: **ax² + bx + c = 0**

**🎯 THREE METHODS TO SOLVE:**

**1. Factoring** (when possible)
   • Example: x² + 5x + 6 = 0
   • Factor: (x + 2)(x + 3) = 0
   • Solutions: x = -2 or x = -3
   • ✓ Fastest when factors are obvious

**2. Quadratic Formula** (always works!)
   • **x = [-b ± √(b² - 4ac)] / 2a**
   • Example: 2x² + 3x - 5 = 0
   • Here: a=2, b=3, c=-5
   • x = [-3 ± √(9 + 40)] / 4
   • x = [-3 ± 7] / 4
   • x = 1 or x = -2.5

**3. Completing the Square**
   • Useful for deriving the quadratic formula
   • Creates perfect square trinomial

**🔍 DISCRIMINANT (b² - 4ac):**
• > 0: Two real solutions
• = 0: One real solution (repeated)
• < 0: Two complex solutions

**💡 REAL-WORLD APPLICATIONS:**
• Projectile motion (physics)
• Area optimization (engineering)
• Profit maximization (business)
• Signal processing (electronics)

**🎓 PRO TIPS:**
1. Always check if you can factor first
2. Verify solutions by substituting back
3. Graph to visualize solutions
4. Remember: parabolas are symmetric!

What specific quadratic problem are you working on? Share it and I'll solve it step-by-step!`;
    }
    
    // Calculus - Limits
    if (q.includes('limit') && (q.includes('calculus') || q.includes('infinity'))) {
      return `📊 **Limits - The Foundation of Calculus**

Limits describe what happens as we approach a value!

**🎯 CORE CONCEPT:**
lim(x→a) f(x) = L means: "As x gets closer to a, f(x) gets closer to L"

**📝 ESSENTIAL LIMIT LAWS:**

**1. Sum/Difference:**
   lim(x→a) [f(x) ± g(x)] = lim(x→a) f(x) ± lim(x→a) g(x)

**2. Product:**
   lim(x→a) [f(x) · g(x)] = [lim(x→a) f(x)] · [lim(x→a) g(x)]

**3. Quotient:**
   lim(x→a) [f(x)/g(x)] = [lim(x→a) f(x)] / [lim(x→a) g(x)]
   (provided denominator ≠ 0)

**🔧 TECHNIQUES FOR SOLVING:**

**Direct Substitution** (try first!)
• If no division by zero, just plug in the value
• Example: lim(x→2) (x² + 3x) = 4 + 6 = 10

**Factoring** (for 0/0 indeterminate forms)
• Example: lim(x→3) (x² - 9)/(x - 3)
• Factor: (x + 3)(x - 3)/(x - 3)
• Cancel: x + 3
• Substitute: 3 + 3 = 6

**L'Hôpital's Rule** (for 0/0 or ∞/∞)
• If lim f(x)/g(x) gives 0/0 or ∞/∞
• Then lim f(x)/g(x) = lim f'(x)/g'(x)

**Conjugate Multiplication** (for radicals)
• Multiply by conjugate to rationalize

**🌟 SPECIAL LIMITS:**
• lim(x→0) (sin x)/x = 1
• lim(x→∞) (1 + 1/x)^x = e ≈ 2.718
• lim(x→0) (1 - cos x)/x = 0

**💡 INTUITIVE UNDERSTANDING:**
Think of limits as asking: "Where is the function heading?"
• Like driving toward a city - the limit is the city
• Even if there's a pothole (discontinuity), we know where we're going!

**🎓 COMMON MISTAKES TO AVOID:**
❌ Dividing by zero without factoring first
❌ Forgetting to check one-sided limits
❌ Confusing limit value with function value
✓ Always check if direct substitution works first!

What limit problem are you stuck on? Share it!`;
    }
    
    // Linear Algebra
    if (q.includes('matrix') || q.includes('matrices') || q.includes('linear algebra') || q.includes('eigenvector')) {
      return `🔢 **Linear Algebra - Matrix Operations & Applications**

Linear algebra is the mathematics of vectors and matrices!

**📊 MATRIX BASICS:**

**Matrix Multiplication** (NOT commutative!)
• (AB) ≠ (BA) in general
• Dimensions must match: (m×n)(n×p) = (m×p)
• Element formula: C[i,j] = Σ A[i,k] · B[k,j]

**Example:**
\`\`\`
[1 2]   [5 6]   [1·5+2·7  1·6+2·8]   [19 22]
[3 4] × [7 8] = [3·5+4·7  3·6+4·8] = [43 50]
\`\`\`

**🎯 KEY CONCEPTS:**

**1. Determinant** (2×2 matrix)
   | a  b |
   | c  d | = ad - bc
   
   **Meaning:** Area scaling factor of transformation
   • det = 0 → Matrix is singular (non-invertible)
   • det ≠ 0 → Matrix is invertible

**2. Inverse Matrix** (A⁻¹)
   • A · A⁻¹ = I (identity matrix)
   • For 2×2: A⁻¹ = (1/det) × [d  -b]
                              [-c   a]
   • **Use:** Solving systems Ax = b → x = A⁻¹b

**3. Eigenvalues & Eigenvectors**
   • Av = λv (where λ is eigenvalue, v is eigenvector)
   • **Meaning:** Directions that only scale, don't rotate
   • **Applications:** 
     - Google PageRank algorithm
     - Quantum mechanics
     - Image compression (PCA)
     - Stability analysis

**🔧 SOLVING LINEAR SYSTEMS:**

**Gaussian Elimination:**
1. Write augmented matrix [A|b]
2. Row reduce to row echelon form
3. Back-substitute

**Example:**
\`\`\`
2x + y = 5
x + 3y = 6

[2  1 | 5]    [1  3 | 6]    [1  3 | 6]
[1  3 | 6] → [2  1 | 5] → [0 -5 |-7]

Back-substitute: y = 7/5, x = 9/5
\`\`\`

**💡 REAL-WORLD APPLICATIONS:**

**Computer Graphics:**
• Rotation matrix: transforms 3D objects
• Translation: moves objects in space
• Scaling: resize objects

**Machine Learning:**
• Neural networks: matrix operations
• Data transformation: change of basis
• Dimensionality reduction: PCA

**Engineering:**
• Circuit analysis: node equations
• Structural analysis: force balance
• Control systems: state-space models

**🎓 STUDY TIPS:**
1. **Visualize:** Matrices transform space!
2. **Practice:** Do computations by hand first
3. **Check:** Verify inverse by multiplication
4. **Understand:** Don't just memorize formulas

**Common Operations Cheat Sheet:**
• Transpose: A^T → flip across diagonal
• Identity: I → ones on diagonal, zeros elsewhere
• Zero matrix: O → all zeros
• Symmetric: A = A^T

What specific linear algebra concept needs clarification?`;
    }
    
    // Statistics and Probability
    if (q.includes('statistics') || q.includes('probability') || q.includes('standard deviation') || q.includes('mean')) {
      return `📊 **Statistics & Probability - Data Analysis Fundamentals**

Statistics helps us make sense of data and uncertainty!

**📈 DESCRIPTIVE STATISTICS:**

**Measures of Center:**
• **Mean (μ or x̄):** Average = Σx / n
• **Median:** Middle value when sorted
• **Mode:** Most frequent value

**When to use each:**
• Mean: Normal distribution, no outliers
• Median: Skewed data, has outliers (better for income, house prices)
• Mode: Categorical data (most popular color)

**Measures of Spread:**
• **Range:** Max - Min (sensitive to outliers)
• **Variance (σ²):** Average squared deviation
  - σ² = Σ(x - μ)² / n
• **Standard Deviation (σ):** √variance
  - Same units as original data!
  - **68-95-99.7 Rule:** In normal distribution
    - 68% within 1σ
    - 95% within 2σ
    - 99.7% within 3σ

**Example:**
Data: [2, 4, 4, 6, 8]
• Mean = (2+4+4+6+8)/5 = 4.8
• Median = 4 (middle value)
• Mode = 4 (appears twice)
• Range = 8-2 = 6
• Variance ≈ 4.16
• SD ≈ 2.04

**🎲 PROBABILITY FUNDAMENTALS:**

**Basic Rules:**
• P(A) = favorable outcomes / total outcomes
• 0 ≤ P(A) ≤ 1
• P(not A) = 1 - P(A)

**Addition Rule:**
• P(A or B) = P(A) + P(B) - P(A and B)
• If mutually exclusive: P(A or B) = P(A) + P(B)

**Multiplication Rule:**
• P(A and B) = P(A) × P(B|A)
• If independent: P(A and B) = P(A) × P(B)

**Conditional Probability:**
• P(A|B) = P(A and B) / P(B)
• "Probability of A given B happened"

**🎯 COMMON DISTRIBUTIONS:**

**1. Normal Distribution (Bell Curve)**
   • Most common in nature
   • Defined by mean (μ) and SD (σ)
   • Examples: Heights, test scores, measurement errors

**2. Binomial Distribution**
   • n trials, each success/fail
   • P(X = k) = C(n,k) × p^k × (1-p)^(n-k)
   • Example: Coin flips, quality control

**3. Poisson Distribution**
   • Count of events in fixed time/space
   • Example: Customers per hour, typos per page

**💡 HYPOTHESIS TESTING:**

**Steps:**
1. **State hypotheses:**
   - H₀ (null): No effect/difference
   - H₁ (alternative): There is an effect

2. **Choose significance level:** α = 0.05 typical

3. **Calculate test statistic:** z-score or t-score

4. **Find p-value:** Probability of result if H₀ true

5. **Decision:**
   - p < α: Reject H₀ (significant!)
   - p ≥ α: Fail to reject H₀

**🔍 CORRELATION vs CAUSATION:**
• r = correlation coefficient (-1 to +1)
• r close to ±1: Strong linear relationship
• r close to 0: Weak/no linear relationship
• **Critical:** Correlation ≠ Causation!
  - Ice cream sales correlate with drowning deaths
  - But ice cream doesn't cause drowning!
  - Hidden variable: summer weather

**🎓 PRACTICAL TIPS:**

**For Exams:**
1. Draw pictures (distributions, trees)
2. Write out formulas before calculating
3. Check if answer makes sense
4. Units! Units! Units!

**Common Mistakes:**
❌ Confusing variance and standard deviation
❌ Forgetting to square when finding variance
❌ Using mean with skewed data
❌ Claiming causation from correlation
✓ Always visualize data first!

**📱 REAL APPLICATIONS:**
• A/B testing in tech companies
• Clinical trials for new medicines
• Quality control in manufacturing
• Sports analytics and sabermetrics
• Financial risk assessment

What statistical concept or problem can I help clarify?`;
    }
    
    return null;
  }

  // Physics responses with real-world connections
  getPhysicsResponse(question: string): string | null {
    const q = question.toLowerCase();
    
    if (q.includes('newton') && (q.includes('law') || q.includes('motion'))) {
      return `⚛️ **Newton's Laws of Motion - Foundation of Classical Physics**

These three laws explain how objects move in our universe!

**🎯 THE THREE LAWS:**

**1. LAW OF INERTIA**
   *"An object at rest stays at rest, and an object in motion stays in motion with constant velocity, unless acted upon by an external force."*
   
   **Real-world examples:**
   • Seatbelts: You keep moving forward when car stops
   • Magic tablecloth trick: Dishes stay put due to inertia
   • Space probes: Keep moving without fuel once launched
   
   **Key insight:** Objects "resist" changes in motion
   **Mass = "laziness factor"** (more mass = more inertia)

**2. F = ma (Force equals mass times acceleration)**
   *"The acceleration of an object is directly proportional to net force and inversely proportional to mass."*
   
   **Formula breakdown:**
   • F (Newtons) = m (kg) × a (m/s²)
   • Rearrange: a = F/m or m = F/a
   
   **Example problem:**
   Q: 10N force on 2kg object. Find acceleration?
   A: a = F/m = 10/2 = 5 m/s²
   
   **Real applications:**
   • Rocket launches: Need huge force to accelerate massive rocket
   • Sports: Lighter baseball accelerates faster than bowling ball with same force
   • Car design: Heavier cars need more force to accelerate

**3. ACTION-REACTION**
   *"For every action, there is an equal and opposite reaction."*
   
   **CRITICAL UNDERSTANDING:**
   Forces act on DIFFERENT objects!
   
   **Examples:**
   • Walking: You push Earth backward, Earth pushes you forward
   • Rocket thrust: Gas expelled down, rocket pushed up
   • Swimming: Push water back, water pushes you forward
   • Book on table: Book pushes down on table (weight), table pushes up on book (normal force)
   
   **Common misconception:**
   ❌ "If forces are equal and opposite, why does anything move?"
   ✓ Forces act on different objects! Net force on ONE object determines its motion.

**🔧 PROBLEM-SOLVING STRATEGY:**

**Step 1: Free Body Diagram (FBD)**
   • Draw object as dot
   • Show ALL forces as arrows
   • Label each force

**Step 2: Choose coordinate system**
   • Usually x (horizontal), y (vertical)
   • Align with motion when possible

**Step 3: Sum forces in each direction**
   • ΣFₓ = maₓ
   • ΣFᵧ = maᵧ

**Step 4: Solve**
   • Plug in known values
   • Solve for unknown

**💡 WORKED EXAMPLE:**

*A 5kg box is pushed with 20N force on a surface with 8N friction. Find acceleration.*

**Solution:**
1. FBD: Applied force (20N →), Friction (8N ←)
2. ΣF = ma
3. 20 - 8 = 5a
4. 12 = 5a
5. a = 2.4 m/s²

**🌟 TYPES OF FORCES:**

**Contact Forces:**
• Normal force (N): Perpendicular to surface
• Friction (f): Opposes motion, f = μN
• Tension (T): Through rope/string
• Applied force (F): Push or pull

**Non-contact Forces:**
• Gravity (W = mg): Always downward
• Electromagnetic: Magnets, static electricity
• Nuclear: Inside atoms

**🎓 MASTER THESE CONCEPTS:**

1. **Weight vs Mass:**
   • Mass: Amount of matter (kg) - constant everywhere
   • Weight: Force due to gravity (N) - W = mg
   • On Moon: Same mass, 1/6 weight!

2. **Equilibrium:**
   • ΣF = 0 (no acceleration)
   • Can be moving (constant velocity)
   • Or at rest (stationary)

3. **Newton's 2nd in components:**
   • ΣFₓ = maₓ
   • ΣFᵧ = maᵧ
   • Treat x and y independently!

**📱 MODERN APPLICATIONS:**
• Self-driving cars: Calculate braking forces
• Sports science: Optimize athlete performance
• Aerospace: Design aircraft and spacecraft
• Robotics: Program precise movements
• Video games: Realistic physics engines

**Common exam questions:**
• Blocks on inclines
• Pulleys and ropes (tension)
• Connected masses
• Friction problems
• Circular motion (centripetal force)

What specific Newton's Laws problem are you working on?`;
    }
    
    if (q.includes('energy') || q.includes('kinetic') || q.includes('potential')) {
      return `⚡ **Energy - The Currency of Physics**

Energy cannot be created or destroyed, only transformed!

**🎯 TYPES OF MECHANICAL ENERGY:**

**1. Kinetic Energy (KE) - Energy of Motion**
   • **Formula: KE = ½mv²**
   • m = mass (kg)
   • v = velocity (m/s)
   
   **Key insights:**
   • Doubles mass → double KE
   • Doubles velocity → quadruple KE! (v²)
   • Always positive (v² is always +)
   
   **Example:**
   Car: m = 1000kg, v = 20 m/s
   KE = ½(1000)(20²) = 200,000 J

**2. Gravitational Potential Energy (PE)**
   • **Formula: PE = mgh**
   • m = mass (kg)
   • g = 9.8 m/s² (gravity)
   • h = height (m)
   
   **Meaning:** Energy stored due to position
   • Higher = more potential energy
   • Reference point matters (h=0 is arbitrary)
   
   **Example:**
   5kg ball at 10m height:
   PE = (5)(9.8)(10) = 490 J

**3. Elastic Potential Energy (Springs)**
   • **Formula: PE = ½kx²**
   • k = spring constant (N/m)
   • x = displacement from equilibrium
   
   **Applications:**
   • Trampolines, bungee jumping
   • Car suspension systems
   • Watches and clocks

**🔄 CONSERVATION OF ENERGY:**

**The Big Idea:**
Total energy before = Total energy after
**E₁ = E₂**

**For mechanical systems:**
**KE₁ + PE₁ = KE₂ + PE₂**

**💡 CLASSIC PROBLEM: Ball Dropped from Height**

*Ball (2kg) dropped from 20m. Find speed at ground.*

**Energy approach:**
• Top: KE=0 (not moving), PE=mgh
• Bottom: KE=½mv², PE=0 (h=0)
• Conservation: mgh = ½mv²
• Solve: gh = ½v²
• v² = 2gh = 2(9.8)(20) = 392
• v = 19.8 m/s

**Alternative: Kinematics**
v² = u² + 2as
v² = 0 + 2(9.8)(20) = 392
v = 19.8 m/s ✓ Same answer!

**🎢 ROLLER COASTER PHYSICS:**

Perfect example of energy transformation!

**At top of hill:**
• High PE, low KE (moving slowly)
• All that height = stored energy

**At bottom:**
• Low PE, high KE (moving fast!)
• Height converted to speed

**Energy equation:**
mgh₁ + ½mv₁² = mgh₂ + ½mv₂²

Notice: mass cancels out!
Height and speed determine everything.

**⚙️ WORK-ENERGY THEOREM:**

**Work = Change in Kinetic Energy**
**W = ΔKE = KE₂ - KE₁**

**Work formula:**
• W = F·d·cos(θ)
• F = force (N)
• d = displacement (m)
• θ = angle between F and d

**Special cases:**
• θ = 0° (same direction): W = Fd (maximum work)
• θ = 90° (perpendicular): W = 0 (no work!)
• θ = 180° (opposite): W = -Fd (negative work)

**🔋 POWER - Rate of Energy Transfer:**

**P = W/t** or **P = F·v**
• Measured in Watts (W) or Joules/second
• 1 horsepower = 746 W

**Example:**
Lift 50kg box 3m in 2 seconds:
• W = mgh = (50)(9.8)(3) = 1470 J
• P = W/t = 1470/2 = 735 W ≈ 1 horsepower

**💡 REAL-WORLD ENERGY:**

**Efficiency:**
• η = (useful energy out / total energy in) × 100%
• No machine is 100% efficient!
• Lost to friction, heat, sound

**Energy in everyday life:**
• Lightbulb: 60W = 60 J/s
• Laptop: ~50W
• Electric car: ~15 kWh/100km
• Human: ~2000 kcal/day ≈ 100W average

**🎓 PROBLEM-SOLVING TIPS:**

**Choose the right tool:**
• **Energy:** When you know heights/speeds
• **Forces:** When you need acceleration
• **Both:** Often complement each other!

**Energy advantages:**
✓ Don't need to know time
✓ Don't need acceleration
✓ Don't need to track entire path
✓ Scalars are easier than vectors!

**Common mistakes:**
❌ Forgetting to square velocity in KE
❌ Using wrong height reference
❌ Mixing up PE and KE
❌ Forgetting negative work
✓ Draw before/after diagrams!
✓ List all energy forms in each state!

**Advanced topics:**
• Non-conservative forces (friction)
• Thermal energy
• Energy in collisions
• Rotational kinetic energy
• E = mc² (mass-energy equivalence)

What energy problem can I help you solve?`;
    }
    
    return null;
  }

  // Programming with real code examples
  getProgrammingResponse(question: string): string | null {
    const q = question.toLowerCase();
    
    if (q.includes('recursion') || q.includes('recursive')) {
      return `🔄 **Recursion - A Function Calling Itself**

Recursion is when a function calls itself to solve smaller versions of the same problem!

**🎯 THE RECURSIVE PATTERN:**

Every recursive function needs:
1. **Base case:** When to stop (prevents infinite recursion)
2. **Recursive case:** Call itself with simpler input
3. **Progress:** Each call moves toward base case

**💡 CLASSIC EXAMPLE: Factorial**

n! = n × (n-1) × (n-2) × ... × 2 × 1

**Python Implementation:**
\`\`\`python
def factorial(n):
    # Base case: stop recursion
    if n == 0 or n == 1:
        return 1
    
    # Recursive case: n! = n × (n-1)!
    return n * factorial(n - 1)

# Execution trace for factorial(4):
# factorial(4) = 4 * factorial(3)
#              = 4 * (3 * factorial(2))
#              = 4 * (3 * (2 * factorial(1)))
#              = 4 * (3 * (2 * 1))
#              = 24
\`\`\`

**JavaScript Version:**
\`\`\`javascript
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
\`\`\`

**🌳 TREE RECURSION: Fibonacci**

Each call branches into two recursive calls!

**Python:**
\`\`\`python
def fibonacci(n):
    """Returns nth Fibonacci number"""
    # Base cases
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    # Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)

# Call tree for fib(5):
#                fib(5)
#              /        \\
#         fib(4)        fib(3)
#        /     \\        /     \\
#    fib(3)  fib(2)  fib(2)  fib(1)
#    ...

print(fibonacci(7))  # 13
\`\`\`

**⚠️ Problem:** This is slow! fib(5) calls fib(3) multiple times.

**✅ Solution: Memoization**
\`\`\`python
def fib_memo(n, memo={}):
    """Optimized with memoization"""
    if n in memo:
        return memo[n]
    
    if n <= 1:
        return n
    
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# Now much faster!
print(fib_memo(100))  # Works instantly
\`\`\`

**📚 PRACTICAL EXAMPLES:**

**1. Sum of Array/List**
\`\`\`python
def sum_list(arr):
    # Base case: empty list
    if len(arr) == 0:
        return 0
    
    # Recursive: first element + sum of rest
    return arr[0] + sum_list(arr[1:])

print(sum_list([1, 2, 3, 4, 5]))  # 15
\`\`\`

**2. Reverse a String**
\`\`\`python
def reverse_string(s):
    # Base case
    if len(s) <= 1:
        return s
    
    # Last char + reverse of rest
    return s[-1] + reverse_string(s[:-1])

print(reverse_string("hello"))  # "olleh"
\`\`\`

**3. Binary Search (Recursive)**
\`\`\`python
def binary_search(arr, target, left, right):
    # Base case: not found
    if left > right:
        return -1
    
    mid = (left + right) // 2
    
    # Found it!
    if arr[mid] == target:
        return mid
    
    # Search left half
    elif arr[mid] > target:
        return binary_search(arr, target, left, mid - 1)
    
    # Search right half
    else:
        return binary_search(arr, target, mid + 1, right)

arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7, 0, len(arr)-1))  # 3
\`\`\`

**4. Directory Traversal**
\`\`\`python
import os

def list_files(directory, indent=0):
    """Recursively list all files in directory"""
    items = os.listdir(directory)
    
    for item in items:
        path = os.path.join(directory, item)
        print("  " * indent + item)
        
        # Recursive case: it's a directory
        if os.path.isdir(path):
            list_files(path, indent + 1)

list_files("/my/folder")
\`\`\`

**🎯 RECURSION vs ITERATION:**

**When to use Recursion:**
✓ Tree/graph traversal
✓ Divide and conquer algorithms
✓ Mathematical sequences
✓ Backtracking problems
✓ Code is more elegant/readable

**When to use Iteration:**
✓ Simple loops
✓ Performance critical
✓ Stack space is limited
✓ Straightforward operations

**Comparison:**
\`\`\`python
# Recursive - elegant
def countdown_recursive(n):
    if n <= 0:
        print("Blast off!")
    else:
        print(n)
        countdown_recursive(n - 1)

# Iterative - faster
def countdown_iterative(n):
    while n > 0:
        print(n)
        n -= 1
    print("Blast off!")
\`\`\`

**⚙️ HOW RECURSION WORKS:**

**The Call Stack:**
\`\`\`
factorial(3)
  ↓ calls factorial(2)
    ↓ calls factorial(1)
      ↓ returns 1
    ↑ returns 2 * 1 = 2
  ↑ returns 3 * 2 = 6
\`\`\`

Each function call is "stacked" in memory.
Base case starts the "unwinding" process.

**🐛 COMMON MISTAKES:**

**1. Missing Base Case**
\`\`\`python
def bad_countdown(n):
    print(n)
    bad_countdown(n - 1)  # Never stops!
# RecursionError: maximum recursion depth exceeded
\`\`\`

**2. Not Making Progress**
\`\`\`python
def stuck(n):
    if n == 0:
        return
    stuck(n)  # Doesn't decrease n!
\`\`\`

**3. Multiple Base Cases Needed**
\`\`\`python
def fib(n):
    if n == 1:  # Missing n == 0!
        return 1
    return fib(n-1) + fib(n-2)
# Fails for fib(0)
\`\`\`

**🎓 ADVANCED RECURSION:**

**Tail Recursion:**
\`\`\`python
def factorial_tail(n, accumulator=1):
    """Tail recursive - last operation is recursive call"""
    if n <= 1:
        return accumulator
    return factorial_tail(n - 1, n * accumulator)

# Some compilers optimize this to iteration!
\`\`\`

**Mutual Recursion:**
\`\`\`python
def is_even(n):
    if n == 0:
        return True
    return is_odd(n - 1)

def is_odd(n):
    if n == 0:
        return False
    return is_even(n - 1)
\`\`\`

**🏆 PRACTICE PROBLEMS:**

Try implementing these recursively:
1. **Power function:** power(base, exp)
2. **Palindrome checker:** is_palindrome(string)
3. **Greatest Common Divisor:** gcd(a, b) using Euclid
4. **Tower of Hanoi:** Classic puzzle
5. **Merge Sort:** Divide and conquer sorting

**💡 DEBUGGING TIPS:**
1. Print inputs at function start
2. Print outputs before return
3. Trace execution manually
4. Check base case thoroughly
5. Verify progress toward base case

What recursive problem are you working on? Share your code!`;
    }
    
    return null;
  }

  // Advanced context-aware response
  getContextualResponse(currentMessage: string, previousMessages: string[]): string {
    // Analyze conversation flow
    const hasAskedFollowUp = previousMessages.length > 1;
    
    if (hasAskedFollowUp) {
      const lastUserMsg = previousMessages[previousMessages.length - 2];
      
      // User asking for clarification
      if (currentMessage.toLowerCase().includes('what') || 
          currentMessage.toLowerCase().includes('how') ||
          currentMessage.toLowerCase().includes('why')) {
        return this.getElaboration(lastUserMsg, currentMessage);
      }
    }
    
    return '';
  }

  private getElaboration(previousTopic: string, question: string): string {
    // Provide deeper explanation based on previous context
    return `Let me elaborate on that in more detail...\n\nBased on your question "${question}", here's a deeper explanation:\n\n`;
  }

  // Chemistry responses
  getChemistryResponse(question: string): string | null {
    const q = question.toLowerCase();
    
    if (q.includes('periodic table') || q.includes('element') || q.includes('atom')) {
      return `⚗️ **Chemistry - Atoms & Periodic Table**

Everything in the universe is made of atoms!

**🔬 ATOMIC STRUCTURE:**

**The Atom:**
• **Nucleus:** Protons (+) and Neutrons (neutral)
• **Electron Cloud:** Electrons (-) orbit nucleus
• **Size:** Nucleus is tiny, atom is mostly empty space!

**Key Numbers:**
• **Atomic Number (Z):** Number of protons
  - Defines the element!
  - H=1, C=6, O=8, Au=79
• **Mass Number (A):** Protons + Neutrons
• **Electrons:** Equal to protons (neutral atom)

**Isotopes:**
• Same protons, different neutrons
• Example: Carbon-12 (6p, 6n) vs Carbon-14 (6p, 8n)
• Used in radiocarbon dating!

**📊 PERIODIC TABLE ORGANIZATION:**

**Periods (Rows):**
• Row number = number of electron shells
• Period 1: 1 shell (H, He)
• Period 2: 2 shells (Li, Be, B, C, N, O, F, Ne)

**Groups (Columns):**
• Same # of valence electrons
• Similar chemical properties!

**Important Groups:**
• **Group 1:** Alkali metals (Li, Na, K) - very reactive
• **Group 2:** Alkaline earth metals (Mg, Ca)
• **Group 17:** Halogens (F, Cl, Br, I) - very reactive
• **Group 18:** Noble gases (He, Ne, Ar) - unreactive!

**🎯 CHEMICAL BONDING:**

**1. Ionic Bonds**
   • Transfer of electrons
   • Metal + Nonmetal
   • Example: NaCl (table salt)
   • Na loses 1e⁻ → Na⁺
   • Cl gains 1e⁻ → Cl⁻
   • Opposite charges attract!

**2. Covalent Bonds**
   • Sharing of electrons
   • Nonmetal + Nonmetal
   • Example: H₂O (water)
   • O shares electrons with 2 H atoms
   • Forms molecules

**3. Metallic Bonds**
   • Sea of delocalized electrons
   • Why metals conduct electricity!

**⚛️ ELECTRON CONFIGURATION:**

**Rules:**
1. **Aufbau:** Fill lowest energy first
2. **Pauli Exclusion:** Max 2 electrons per orbital
3. **Hund's Rule:** Fill orbitals singly first

**Order:** 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p...

**Example - Carbon (6 electrons):**
1s² 2s² 2p²

**Example - Iron (26 electrons):**
1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶

**Shorthand:** [Ar] 4s² 3d⁶

**🧪 CHEMICAL REACTIONS:**

**Balancing Equations:**
Law of Conservation of Mass

**Example:** Combustion of methane
CH₄ + O₂ → CO₂ + H₂O (unbalanced)

**Count atoms:**
Left: 1C, 4H, 2O
Right: 1C, 2H, 3O (not balanced!)

**Balanced:**
CH₄ + 2O₂ → CO₂ + 2H₂O

Left: 1C, 4H, 4O
Right: 1C, 4H, 4O ✓

**Types of Reactions:**
• Synthesis: A + B → AB
• Decomposition: AB → A + B
• Single Replacement: A + BC → AC + B
• Double Replacement: AB + CD → AD + CB
• Combustion: Hydrocarbon + O₂ → CO₂ + H₂O

**💡 MOLES & STOICHIOMETRY:**

**Mole:** 6.022 × 10²³ particles (Avogadro's number)

**Molar Mass:**
• Sum of atomic masses
• H₂O = 2(1) + 16 = 18 g/mol

**Converting:**
• Moles = Mass / Molar Mass
• Particles = Moles × 6.022×10²³

**Example Problem:**
How many molecules in 36g of water?

1. Molar mass H₂O = 18 g/mol
2. Moles = 36/18 = 2 mol
3. Molecules = 2 × 6.022×10²³ = 1.204×10²⁴

**🎓 REAL-WORLD APPLICATIONS:**
• Medicine: Drug design
• Environment: Climate science
• Technology: Batteries, semiconductors
• Food: Cooking is chemistry!
• Forensics: Crime scene analysis

What chemistry topic needs clarification?`;
    }
    
    if (q.includes('acid') || q.includes('base') || q.includes('ph')) {
      return `🧪 **Acids, Bases, and pH - Chemical Balance**

Acids and bases are everywhere in daily life!

**🎯 DEFINITIONS:**

**Arrhenius Definition:**
• **Acid:** Produces H⁺ in water
  - HCl → H⁺ + Cl⁻
• **Base:** Produces OH⁻ in water
  - NaOH → Na⁺ + OH⁻

**Brønsted-Lowry Definition (Better!):**
• **Acid:** Proton (H⁺) donor
• **Base:** Proton (H⁺) acceptor

**Example:** HCl + H₂O → H₃O⁺ + Cl⁻
• HCl donates H⁺ (acid)
• H₂O accepts H⁺ (base)

**📊 THE pH SCALE:**

**pH = -log[H⁺]**

**Scale: 0 to 14**
• **0-6:** Acidic (more H⁺)
• **7:** Neutral (pure water)
• **8-14:** Basic/Alkaline (more OH⁻)

**Common Examples:**
• Battery acid: pH 0
• Stomach acid: pH 1-2
• Lemon juice: pH 2
• Coffee: pH 5
• Pure water: pH 7
• Baking soda: pH 9
• Bleach: pH 13
• Drain cleaner: pH 14

**Important:** pH scale is logarithmic!
• pH 5 is 10× more acidic than pH 6
• pH 4 is 100× more acidic than pH 6

**🧮 CALCULATIONS:**

**Finding pH:**
[H⁺] = 1×10⁻³ M
pH = -log(1×10⁻³) = 3

**Finding [H⁺] from pH:**
pH = 5
[H⁺] = 10⁻⁵ M = 0.00001 M

**Water Equilibrium:**
Kw = [H⁺][OH⁻] = 1×10⁻¹⁴

**If you know one, find the other:**
[H⁺] = 1×10⁻³
[OH⁻] = 1×10⁻¹⁴ / 1×10⁻³ = 1×10⁻¹¹

**⚗️ STRONG vs WEAK:**

**Strong Acids (100% ionization):**
• HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄
• Completely dissociate in water
• HCl → H⁺ + Cl⁻ (complete)

**Weak Acids (partial ionization):**
• CH₃COOH (acetic acid/vinegar)
• H₂CO₃ (carbonic acid)
• Equilibrium: HA ⇌ H⁺ + A⁻

**Strong Bases:**
• NaOH, KOH, Ca(OH)₂
• Complete dissociation

**Weak Bases:**
• NH₃ (ammonia)
• Many organic compounds

**🎨 INDICATORS:**

**Litmus Paper:**
• Red in acid
• Blue in base

**Phenolphthalein:**
• Colorless in acid
• Pink in base

**Universal Indicator:**
• Color changes across pH range
• Red (acid) → Yellow → Green (neutral) → Blue → Purple (base)

**💧 NEUTRALIZATION:**

**Acid + Base → Salt + Water**

**Example:**
HCl + NaOH → NaCl + H₂O
H⁺ + OH⁻ → H₂O

**Titration:**
Finding unknown concentration

**Problem:**
25 mL of HCl neutralized by 30 mL of 0.1M NaOH
Find [HCl]?

**Solution:**
Moles NaOH = 0.03L × 0.1M = 0.003 mol
Moles HCl = 0.003 mol (1:1 ratio)
[HCl] = 0.003/0.025 = 0.12 M

**🍋 EVERYDAY ACIDS & BASES:**

**Acids:**
• Citric acid: Citrus fruits
• Acetic acid: Vinegar
• Carbonic acid: Soda
• Lactic acid: Sour milk, muscles
• Ascorbic acid: Vitamin C

**Bases:**
• Sodium bicarbonate: Baking soda
• Ammonia: Cleaners
• Sodium hydroxide: Soap making
• Calcium hydroxide: Cement

**🎓 APPLICATIONS:**

**Biology:**
• Blood pH: 7.35-7.45 (tightly controlled!)
• Stomach acid: Digestion
• Ocean acidification: Environmental issue

**Medicine:**
• Antacids: Neutralize stomach acid
• Aspirin: Weak acid
• Drug solubility depends on pH

**Industry:**
• Swimming pools: pH 7.2-7.8
• Agriculture: Soil pH affects crops
• Food preservation: Pickling

**🧬 BUFFER SOLUTIONS:**

Resist pH changes!

**How they work:**
Weak acid + its conjugate base
• HA ⇌ H⁺ + A⁻

**Add acid:** A⁻ absorbs H⁺
**Add base:** HA releases H⁺

**Example:** Blood buffer
H₂CO₃ ⇌ H⁺ + HCO₃⁻

**Henderson-Hasselbalch:**
pH = pKa + log([A⁻]/[HA])

**Common Mistakes:**
❌ Confusing pH and [H⁺]
❌ Forgetting logarithmic scale
❌ Mixing strong and weak
✓ Practice calculations!
✓ Understand ionization!

What pH or acid-base question do you have?`;
    }
    
    return null;
  }

  // Biology responses
  getBiologyResponse(question: string): string | null {
    const q = question.toLowerCase();
    
    if (q.includes('cell') || q.includes('mitochondria') || q.includes('organelle')) {
      return `🧬 **Cell Biology - The Building Blocks of Life**

Cells are the fundamental units of all living organisms!

**🔬 TWO MAIN CELL TYPES:**

**1. PROKARYOTIC (Simple)**
   • No nucleus
   • No membrane-bound organelles
   • Smaller (1-10 μm)
   • Examples: Bacteria, Archaea
   • DNA in nucleoid region

**2. EUKARYOTIC (Complex)**
   • Has nucleus
   • Membrane-bound organelles
   • Larger (10-100 μm)
   • Examples: Animals, plants, fungi, protists
   • DNA in chromosomes

**🏢 ORGANELLES - "Little Organs"**

**Nucleus** (Control Center)
• Contains DNA/genetic information
• Surrounded by nuclear membrane
• Nucleolus: Makes ribosomes
• "Brain of the cell"

**Mitochondria** (Power Plants)
• **"Powerhouse of the cell!"**
• Cellular respiration: C₆H₁₂O₆ + O₂ → ATP + CO₂ + H₂O
• Makes ATP (cellular energy currency)
• Has own DNA! (inherited from mother)
• Double membrane

**Endoplasmic Reticulum (ER)** (Manufacturing)
• **Rough ER:** Has ribosomes, makes proteins
• **Smooth ER:** Makes lipids, detoxifies

**Golgi Apparatus** (Post Office)
• Modifies, packages, ships proteins
• Adds "address labels" to proteins
• Sends to correct destination

**Ribosomes** (Protein Factories)
• Read mRNA, build proteins
• Can be free or attached to rough ER
• Made of rRNA and proteins

**Lysosomes** (Recycling Centers)
• Contain digestive enzymes
• Break down waste, old organelles
• "Garbage disposal"
• Animal cells mainly

**Chloroplasts** (Solar Panels - PLANTS ONLY)
• Photosynthesis: CO₂ + H₂O + light → C₆H₁₂O₆ + O₂
• Contains chlorophyll (green pigment)
• Double membrane
• Has own DNA!

**Cell Membrane** (Security Guard)
• Selectively permeable barrier
• Controls what enters/exits
• Phospholipid bilayer
• Proteins embedded for transport

**Cell Wall** (PLANTS, FUNGI, BACTERIA)
• Rigid outer layer
• Provides structure and support
• Made of cellulose (plants)

**⚡ CELLULAR RESPIRATION:**

**Purpose:** Break down glucose to make ATP

**Three Stages:**

**1. Glycolysis** (Cytoplasm)
   • Glucose (6C) → 2 Pyruvate (3C)
   • Makes 2 ATP, 2 NADH
   • Doesn't need oxygen!

**2. Krebs Cycle** (Mitochondrial matrix)
   • Pyruvate → CO₂ + energy carriers
   • Makes 2 ATP, 6 NADH, 2 FADH₂
   • Needs oxygen (aerobic)

**3. Electron Transport Chain** (Inner mitochondrial membrane)
   • Uses NADH and FADH₂
   • Makes ~34 ATP!
   • Oxygen is final electron acceptor

**Total:** ~38 ATP per glucose

**Equation:**
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~38 ATP

**🌱 PHOTOSYNTHESIS (Plants):**

**Purpose:** Make glucose from sunlight

**Two Stages:**

**1. Light-Dependent Reactions** (Thylakoids)
   • Need light
   • Split water: 2H₂O → O₂ + 4H⁺ + 4e⁻
   • Make ATP and NADPH
   • Release O₂ (we breathe this!)

**2. Light-Independent (Calvin Cycle)** (Stroma)
   • Don't need light directly
   • Fix CO₂ into glucose
   • Use ATP and NADPH from light reactions

**Equation:**
6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂

**Notice:** Opposite of cellular respiration!

**🚪 CELL MEMBRANE TRANSPORT:**

**Passive Transport (No energy needed):**

**1. Diffusion**
   • Movement from high → low concentration
   • Example: Perfume spreading in room
   • Continues until equilibrium

**2. Osmosis**
   • Diffusion of WATER across membrane
   • Water moves to balance concentrations
   • **Hypertonic:** More solute outside → cell shrinks
   • **Hypotonic:** Less solute outside → cell swells
   • **Isotonic:** Equal → no net movement

**3. Facilitated Diffusion**
   • Uses protein channels
   • Still high → low concentration
   • Example: Glucose transport

**Active Transport (Requires ATP):**

**1. Protein Pumps**
   • Move against concentration gradient
   • Example: Sodium-Potassium pump (Na⁺/K⁺)
   • Maintains cell balance

**2. Endocytosis**
   • Cell "eats" - brings material in
   • Phagocytosis: Solid particles
   • Pinocytosis: Liquid droplets

**3. Exocytosis**
   • Cell "spits out" - releases material
   • How cells secrete proteins

**🧬 CELL DIVISION:**

**Mitosis (Body Cells)**
• Makes 2 identical daughter cells
• Same # chromosomes as parent
• For growth and repair

**Phases: IPMAT**
• **Interphase:** DNA replication
• **Prophase:** Chromosomes condense
• **Metaphase:** Line up at middle
• **Anaphase:** Chromosomes separate
• **Telophase:** Two nuclei form
• **Cytokinesis:** Cell splits

**Meiosis (Sex Cells)**
• Makes 4 non-identical cells
• Half the chromosomes (haploid)
• For sexual reproduction
• Creates genetic diversity

**🎓 CELL THEORY:**

1. All living things made of cells
2. Cells are basic unit of life
3. All cells come from pre-existing cells

**🔍 COMPARING PLANT vs ANIMAL CELLS:**

**Both Have:**
✓ Nucleus, mitochondria
✓ Cell membrane, ribosomes
✓ ER, Golgi apparatus

**Only Plant Cells:**
✓ Cell wall (rigid)
✓ Chloroplasts (photosynthesis)
✓ Large central vacuole
✓ Rectangular shape

**Only Animal Cells:**
✓ Centrioles (cell division)
✓ Small vacuoles
✓ Round/irregular shape
✓ Lysosomes more common

**💡 REAL-WORLD APPLICATIONS:**
• Cancer: Uncontrolled cell division
• Stem cells: Medical treatments
• Antibiotics: Target bacterial cells
• Genetic engineering: Modify cell DNA

What cell biology concept needs clarification?`;
    }
    
    return null;
  }
}

export const aiKnowledge = new AIKnowledgeBase();
