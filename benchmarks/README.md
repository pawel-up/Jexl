# JEXL Benchmarks

This directory contains performance benchmarks for the JEXL expression library. The benchmarks help track performance characteristics and identify potential optimizations.

## Available Benchmarks

### Expression Benchmarks (`npm run benchmark:expressions`)

Tests the performance of expression parsing, compilation, and evaluation across various scenarios:

#### Simple Expressions

- **Simple literal**: Basic string literals
- **Simple identifier**: Variable access
- **Simple arithmetic**: Basic math operations
- **Simple comparison**: Comparison operators
- **Simple property access**: Object property access

#### Compilation Performance

- **Compile simple expression**: Simple expression compilation
- **Compile complex expression**: Complex expression compilation
- **Compile nested expression**: Nested expression compilation

#### Evaluation Performance

- **Evaluate pre-compiled simple**: Pre-compiled expression evaluation
- **Evaluate pre-compiled complex**: Complex pre-compiled evaluation

#### Operators

- **Binary operations**: Math operations with multiple operators
- **Logical operations**: Boolean logic chains
- **String concatenation**: String joining operations
- **Comparison chain**: Multiple comparison operations

#### Transforms

- **Single transform**: Single pipe transformation
- **Transform chain**: Multiple chained transforms
- **Transform with arguments**: Transforms with parameters

#### Filters

- **Simple array filter**: Basic array filtering
- **Complex array filter**: Multi-condition filtering
- **Nested filter with transform**: Filter + transform combinations
- **Multiple condition filter**: Complex boolean filter logic

#### Property Access

- **Deep property access**: Nested object property access
- **Array index access**: Array element access by index
- **Dynamic property access**: Computed property names

#### Conditionals

- **Ternary operator**: Simple conditional expressions
- **Complex conditional**: Nested ternary operations
- **Elvis operator**: Null coalescing operator

#### Functions

- **Function call**: Function execution
- **Function with context**: Functions using context variables
- **Nested function calls**: Functions calling other functions

#### Literals

- **Object literal**: Object creation expressions
- **Array literal**: Array creation expressions
- **Complex literal**: Nested object/array structures

#### Performance Stress Tests

- **Long expression chain**: Complex transform chains
- **Multiple filter operations**: Chained array filters
- **Complex nested expression**: Multi-level nested operations

#### End-to-End Scenarios

- **E2E: Parse + Eval simple**: Complete simple expression cycle
- **E2E: Parse + Eval complex**: Complete complex expression cycle
- **E2E: Real world scenario**: Realistic usage patterns

### Validation Benchmarks (`npm run benchmark:validation`)

Tests the performance of the JEXL expression validator across different validation scenarios:

#### Basic Validation

- **Valid simple expression**: Simple valid expression validation
- **Valid complex expression**: Complex valid expression validation
- **Quick validity check**: Fast syntax-only validation
- **Get first error**: Error retrieval for invalid expressions

#### Syntax Error Detection

- **Incomplete expressions**: Expressions ending unexpectedly
- **Mismatched brackets**: Bracket pairing errors
- **Consecutive operators**: Invalid operator sequences
- **Empty expressions**: Null and empty string handling
- **Whitespace-only expressions**: Whitespace validation

#### Semantic Validation

- **Unknown functions**: Detection of undefined functions
- **Unknown transforms**: Detection of undefined transforms
- **Unknown operators**: Detection of invalid operators
- **Custom functions/transforms**: Validation with custom extensions

#### Context Validation

- **Strict mode validation**: Context property validation
- **Missing property detection**: Undefined property warnings
- **Lenient mode**: Validation without context requirements
- **Deep context validation**: Nested object validation
- **Array context validation**: Array filtering validation

#### Performance Analysis

- **Complex expression warnings**: Performance impact analysis
- **Deep nesting warnings**: Nesting depth analysis
- **Long expression warnings**: Expression length analysis

#### Comprehensive Validation

- **Full validation**: Complete validation with all options
- **Simple expressions**: Full validation of simple patterns
- **Complex expressions**: Full validation of complex patterns

#### Edge Cases

- **Null input**: Invalid input type handling
- **Non-string input**: Type validation
- **Very long expressions**: Performance with large expressions
- **Deeply nested expressions**: Deep nesting handling

#### Lexical Analysis

- **Valid tokens**: Token recognition performance
- **Invalid characters**: Error detection for bad tokens
- **String literals**: String parsing performance
- **Number literals**: Number parsing performance

#### Expression Types

- **Conditional expressions**: Ternary operator validation
- **Filter expressions**: Array filtering validation
- **Object literals**: Object creation validation
- **Array literals**: Array creation validation
- **Function calls**: Function validation
- **Transform chains**: Transform pipeline validation

#### Formatting and Whitespace

- **Extra whitespace**: Whitespace normalization
- **Newlines**: Multi-line expression handling
- **Tabs**: Tab character handling

#### Real-World Scenarios

- **User permission checks**: Authorization expressions
- **Data transformation pipelines**: ETL-style expressions
- **Template expressions**: String templating
- **Configuration validation**: Settings expressions

#### Batch Operations

- **Multiple simple expressions**: Batch validation performance
- **Multiple complex expressions**: Complex batch operations

## Running Benchmarks

```bash
# Run expression benchmarks
npm run benchmark:expressions

# Run validation benchmarks
npm run benchmark:validation

# Build before running (if needed)
npm run build
```

## Benchmark Results

Results are automatically stored in the `benchmarks/history` directory and include:

- Operations per second (ops/sec) for each test
- Standard deviation and confidence intervals
- Comparison with previous runs (if available)
- Historical trend analysis

## Understanding Results

### Operations Per Second (ops/sec)

Higher numbers indicate better performance. This represents how many times the operation can be executed per second.

### Standard Deviation (±%)

Lower percentages indicate more consistent performance across test runs.

### Sample Count

The number of test iterations used to calculate the benchmark. More samples generally provide more reliable results.

## Performance Considerations

### Expression Performance

- **Simple expressions** (literals, identifiers) are fastest
- **Compilation** has upfront cost but improves repeated evaluation
- **Complex transforms** and **deep nesting** impact performance
- **Array filtering** can be expensive with large datasets

### Validation Performance

- **Syntax-only validation** is fastest
- **Context validation** adds overhead but catches runtime issues
- **Full validation** with warnings/info is most comprehensive but slowest
- **Batch validation** of multiple expressions is efficient

### Optimization Tips

1. **Pre-compile expressions** when evaluating repeatedly
2. **Use simple expressions** when complex logic isn't needed
3. **Limit nesting depth** in complex expressions
4. **Cache validation results** for static expressions
5. **Use lenient validation** during development, strict in production

## Contributing

When adding new benchmarks:

1. Add meaningful test cases that reflect real usage
2. Include both positive and negative test cases
3. Test edge cases and error conditions
4. Group related benchmarks logically
5. Update this documentation

## Benchmark History

Historical benchmark data is stored in `benchmarks/history/` and can be used to:

- Track performance regressions
- Validate optimization improvements
- Analyze performance trends over time
- Compare different implementation approaches
