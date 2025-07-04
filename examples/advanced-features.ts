/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Advanced Features Examples
 *
 * This file demonstrates advanced Jexl features including:
 * - Template literals and string interpolation
 * - Expression compilation and reuse
 * - Complex data transformations
 * - Error handling
 * - Performance optimization techniques
 */

import { Jexl } from '../src/Jexl.js'

async function advancedFeaturesExamples() {
  const jexl = new Jexl()

  console.log('=== Advanced Jexl Features Examples ===\n')

  // Add necessary transforms and functions
  jexl.addTransform('map', (arr: Record<string, unknown>[], property: string) => arr.map((item) => item[property]))
  jexl.addTransform('filter', (arr: Record<string, unknown>[], property: string, value: unknown) =>
    arr.filter((item) => item[property] === value)
  )
  jexl.addTransform('length', (arr: unknown[]) => arr.length)
  jexl.addTransform('unique', (arr: unknown[]) => [...new Set(arr)])
  jexl.addTransform('flat', (arr: unknown[][]) => arr.flat())
  jexl.addTransform('reduce', (arr: number[], fn: string, initial: number) => {
    if (fn === 'sum') return arr.reduce((a, b) => a + b, initial)
    return arr.reduce((a, b) => a + b, initial)
  })

  // Sample complex data
  const context = {
    users: [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@company.com',
        department: 'Engineering',
        salary: 95000,
        skills: ['JavaScript', 'Python', 'React', 'Node.js'],
        projects: [
          { name: 'Project Alpha', status: 'completed', hours: 120 },
          { name: 'Project Beta', status: 'in-progress', hours: 80 },
        ],
        performance: { rating: 4.8, reviews: 12 },
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@company.com',
        department: 'Design',
        salary: 78000,
        skills: ['Figma', 'Photoshop', 'Sketch', 'CSS'],
        projects: [
          { name: 'UI Redesign', status: 'completed', hours: 200 },
          { name: 'Brand Guidelines', status: 'planning', hours: 0 },
        ],
        performance: { rating: 4.6, reviews: 8 },
      },
    ],
    company: {
      name: 'TechCorp Inc.',
      departments: ['Engineering', 'Design', 'Marketing', 'Sales'],
      budget: 2500000,
      quarter: 'Q1',
      year: 2024,
    },
    settings: {
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timezone: 'PST',
    },
  }

  // Template Literals and Expression Compilation
  console.log('--- Template Literals and Compilation ---')

  // Using template literal syntax for dynamic expressions
  const userName = 'Alice Johnson'
  const department = 'Engineering'

  // Note: Template literals do direct string interpolation, so we need to quote strings manually
  const userExpr = jexl.expr`users[.name == "${userName}"]`
  console.log('Template literal user lookup:', await userExpr.eval(context))

  const deptExpr = jexl.expr`users[.department == "${department}"]`
  console.log('Template literal department filter:', await deptExpr.eval(context))

  // For numeric values, no quotes needed
  const minSalary = 80000
  const salaryExpr = jexl.expr`users[.salary >= ${minSalary}]`
  console.log('Template literal salary filter:', await salaryExpr.eval(context))

  // Compile expressions for reuse (performance optimization)
  // Add helper functions for complex operations
  jexl.addFunction('calculateBonus', (salary: number) => salary * 0.15)
  jexl.addFunction('mapUserBonus', (users: Record<string, unknown>[]) =>
    users.map((user) => ({
      name: user.name,
      annualBonus: (user.salary as number) * 0.15,
    }))
  )

  const salaryCalculator = jexl.compile('mapUserBonus(users)')
  console.log('Compiled salary calculation:', await salaryCalculator.eval(context))

  jexl.addFunction('evaluatePerformance', (users: Record<string, unknown>[]) =>
    users.map((user) => ({
      name: user.name,
      grade:
        (user.performance as any).rating >= 4.5
          ? 'Excellent'
          : (user.performance as any).rating >= 4.0
            ? 'Good'
            : 'Needs Improvement',
    }))
  )

  const performanceEvaluator = jexl.compile('evaluatePerformance(users)')
  console.log('Compiled performance evaluation:', await performanceEvaluator.eval(context))
  console.log()

  // Complex Data Transformations
  console.log('--- Complex Data Transformations ---')

  // Add custom transforms for advanced data manipulation
  jexl.addTransform('groupBy', (array: Record<string, unknown>[], key: string) => {
    return array.reduce(
      (groups, item) => {
        const groupKey = String(item[key])
        if (!groups[groupKey]) {
          groups[groupKey] = []
        }
        ;(groups as Record<string, unknown[]>)[groupKey].push(item)
        return groups
      },
      {} as Record<string, Record<string, unknown>[]>
    )
  })

  jexl.addTransform('pivot', (array: Record<string, unknown>[], rowKey: string, colKey: string, valueKey: string) => {
    const result: Record<string, Record<string, unknown>> = {}
    array.forEach((item) => {
      const row = String(item[rowKey])
      const col = String(item[colKey])
      const value = item[valueKey]

      if (!result[row]) {
        result[row] = {}
      }
      result[row][col] = value
    })
    return result
  })

  jexl.addTransform('flatten', (obj: Record<string, unknown>, separator = '.') => {
    const result: Record<string, unknown> = {}

    function flattenRecursive(current: Record<string, unknown>, prefix = '') {
      Object.keys(current).forEach((key) => {
        const newKey = prefix ? `${prefix}${separator}${key}` : key
        const value = current[key]

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flattenRecursive(value as Record<string, unknown>, newKey)
        } else {
          result[newKey] = value
        }
      })
    }

    flattenRecursive(obj)
    return result
  })

  console.log('Group users by department:', await jexl.eval('users | groupBy("department")', context))

  console.log('Flatten user data:', await jexl.eval('users[0] | flatten', context))

  // Add helper function for complex aggregation
  jexl.addFunction('departmentHours', (users: Record<string, unknown>[]) =>
    users.map((user) => ({
      department: user.department,
      totalHours: (user.projects as any[]).reduce((sum, project) => sum + project.hours, 0),
    }))
  )

  console.log('Complex aggregation:', await jexl.eval('departmentHours(users) | groupBy("department")', context))
  console.log()

  // Advanced Filtering and Mapping
  console.log('--- Advanced Filtering and Mapping ---')

  // Add helper functions for complex filtering
  jexl.addFunction('highPerformersWithJS', (users: Record<string, unknown>[]) =>
    users
      .filter((user) => (user.performance as any).rating > 4.5 && (user.skills as string[]).includes('JavaScript'))
      .map((user) => user.name)
  )

  console.log('High performers with specific skills:', await jexl.eval('highPerformersWithJS(users)', context))

  // Add helper for project status extraction
  jexl.addFunction('getAllProjectStatuses', (users: Record<string, unknown>[]) => {
    const allProjects = users.flatMap((user) => user.projects as any[])
    const statuses = allProjects.map((project) => project.status).filter((status) => status)
    return [...new Set(statuses)]
  })

  console.log('All project statuses:', await jexl.eval('getAllProjectStatuses(users)', context))

  // Add helper for department salary statistics
  jexl.addFunction('departmentStats', (users: Record<string, unknown>[]) => {
    const grouped = jexl.grammar.transforms.groupBy(users, 'department')
    return Object.entries(grouped).map(([department, deptUsers]) => {
      const deptUsersArray = deptUsers as Record<string, unknown>[]
      const salaries = deptUsersArray.map((user) => user.salary as number)
      const totalSalary = salaries.reduce((a, b) => a + b, 0)
      return {
        department,
        count: deptUsersArray.length,
        totalSalary,
        avgSalary: totalSalary / deptUsersArray.length,
      }
    })
  })

  console.log('Department salary statistics:', await jexl.eval('departmentStats(users)', context))
  console.log()

  // Error Handling Examples
  console.log('--- Error Handling ---')

  // Add error-safe functions
  jexl.addFunction('safeDivide', (a: number, b: number) => (b === 0 ? null : a / b))
  jexl.addFunction('tryGet', (obj: Record<string, unknown>, path: string, defaultValue: unknown = null) => {
    try {
      return path.split('.').reduce((current: any, key) => current?.[key], obj) ?? defaultValue
    } catch {
      return defaultValue
    }
  })

  jexl.addTransform('withDefault', (value: unknown, defaultValue: unknown) => value ?? defaultValue)

  console.log('Safe division:', await jexl.eval('safeDivide(10, 0)'))
  console.log('Safe property access:', await jexl.eval('tryGet(users[0], "profile.bio", "No bio available")', context))
  console.log('Default value transform:', await jexl.eval('users[0].nickname | withDefault("No nickname")', context))

  // Error handling in expressions
  try {
    await jexl.eval('users[0].nonexistent.property', context)
  } catch (error) {
    console.log('Caught error:', (error as Error).message)
  }
  console.log()

  // Performance Optimization
  console.log('--- Performance Optimization ---')

  // Add a function for benchmarking
  jexl.addFunction('userSummary', (users: Record<string, unknown>[]) =>
    users.map((user) => ({
      name: user.name,
      projectCount: (user.projects as any[]).length,
      avgRating: (user.performance as any).rating,
      skillCount: (user.skills as string[]).length,
    }))
  )

  // Benchmark expression compilation vs evaluation
  const complexExpression = 'userSummary(users)'

  // Measure compilation time
  const startCompile = Date.now()
  const compiledExpr = jexl.compile(complexExpression)
  const compileTime = Date.now() - startCompile
  console.log(`Compilation time: ${compileTime}ms`)

  // Measure evaluation time for compiled expression
  const startEvalCompiled = Date.now()
  const compiledResult = await compiledExpr.eval(context)
  const evalCompiledTime = Date.now() - startEvalCompiled
  console.log(`Compiled evaluation time: ${evalCompiledTime}ms`)

  // Measure evaluation time for direct evaluation
  const startEvalDirect = Date.now()
  const directResult = await jexl.eval(complexExpression, context)
  const evalDirectTime = Date.now() - startEvalDirect
  console.log(`Direct evaluation time: ${evalDirectTime}ms`)

  console.log('Results are equal:', JSON.stringify(compiledResult) === JSON.stringify(directResult))
  console.log()

  // Dynamic Expression Building
  console.log('--- Dynamic Expression Building ---')

  // Build expressions dynamically based on conditions
  function buildFilterExpression(filters: Record<string, unknown>) {
    const conditions = Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key} == "${value}"`
        } else if (typeof value === 'number') {
          return `${key} >= ${value}`
        } else if (Array.isArray(value)) {
          return `${key} in ${JSON.stringify(value)}`
        }
        return `${key} == ${JSON.stringify(value)}`
      })

    return conditions.length > 0 ? `users[${conditions.join(' && ')}]` : 'users'
  }

  const filters = {
    'department': 'Engineering',
    'performance.rating': 4.0,
  }

  const dynamicExpression = buildFilterExpression(filters)
  console.log('Dynamic expression:', dynamicExpression)
  console.log('Dynamic filter result:', await jexl.eval(dynamicExpression, context))
  console.log()

  // Real-world Business Logic Examples
  console.log('--- Real-world Business Logic ---')

  // Employee bonus calculation
  jexl.addFunction('calculateBonusForUser', (salary: number, rating: number, projectHours: number) => {
    const baseBonus = salary * 0.1
    const performanceMultiplier = rating >= 4.5 ? 1.5 : rating >= 4.0 ? 1.2 : 1.0
    const hoursBonus = Math.min(projectHours * 50, 5000)
    return Math.round(baseBonus * performanceMultiplier + hoursBonus)
  })

  jexl.addFunction('calculateAllBonuses', (users: Record<string, unknown>[]) =>
    users.map((user) => {
      const totalHours = (user.projects as any[]).reduce((sum, project) => sum + project.hours, 0)
      return {
        name: user.name,
        bonus: jexl.grammar.functions.calculateBonusForUser(
          user.salary as number,
          (user.performance as any).rating,
          totalHours
        ),
      }
    })
  )

  console.log('Employee bonuses:', await jexl.eval('calculateAllBonuses(users)', context))

  // Project portfolio analysis
  jexl.addFunction('portfolioAnalysis', (users: Record<string, unknown>[]) => {
    const allProjects = users.flatMap((user) => user.projects as any[])
    const completedProjects = allProjects.filter((project) => project.status === 'completed')
    const totalHours = allProjects.reduce((sum, project) => sum + project.hours, 0)

    return {
      totalProjects: allProjects.length,
      completedProjects: completedProjects.length,
      totalHours,
      avgHoursPerProject: totalHours / allProjects.length,
    }
  })

  console.log('Project portfolio analysis:', await jexl.eval('portfolioAnalysis(users)', context))

  // Skills matrix
  jexl.addFunction('skillsMatrix', (users: Record<string, unknown>[]) => {
    const allSkills = [...new Set(users.flatMap((user) => user.skills as string[]))]
    return allSkills.map((skill) => ({
      skill,
      userCount: users.filter((user) => (user.skills as string[]).includes(skill)).length,
      users: users.filter((user) => (user.skills as string[]).includes(skill)).map((user) => user.name),
    }))
  })

  console.log('Skills matrix:', await jexl.eval('skillsMatrix(users)', context))

  // Department budget allocation
  jexl.addFunction('allocateBudget', (totalBudget: number, departments: string[], users: Record<string, unknown>[]) => {
    const deptGroups = jexl.grammar.transforms.groupBy(users, 'department')
    const totalEmployees = users.length

    return departments.map((dept) => {
      const deptUsers = (deptGroups[dept] || []) as Record<string, unknown>[]
      const employeeCount = deptUsers.length
      const avgSalary =
        employeeCount > 0 ? deptUsers.reduce((sum, user) => sum + (user.salary as number), 0) / employeeCount : 0
      const allocation = (employeeCount / totalEmployees) * totalBudget

      return {
        department: dept,
        employees: employeeCount,
        avgSalary,
        budgetAllocation: Math.round(allocation),
      }
    })
  })

  console.log(
    'Budget allocation:',
    await jexl.eval('allocateBudget(company.budget, company.departments, users)', context)
  )
  console.log()
}

// Run the examples
advancedFeaturesExamples().catch(console.error)
