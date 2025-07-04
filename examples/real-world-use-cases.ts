/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Real-world Use Cases Examples
 *
 * This file demonstrates practical, real-world applications of Jexl
 * including data validation, report generation, dynamic filtering,
 * business rules, and API data processing.
 */

import { Jexl } from '../src/Jexl.js'

async function realWorldUseCases() {
  const jexl = new Jexl()

  // Add custom transforms and functions
  jexl.addTransform('sum', (val: number[]) => val.reduce((a, b) => a + b, 0))
  jexl.addTransform('flat', (val: any[][]) => val.flat())
  jexl.addTransform('unique', (val: any[]) => [...new Set(val)])
  jexl.addFunction('len', (val: any[]) => val.length)
  jexl.addFunction('last', (val: any[]) => (val && val.length ? val[val.length - 1] : undefined))
  jexl.addTransform('map', async (val: any[], expr: any) => {
    const subJexl = new Jexl()
    // Manually add functions/transforms needed in the sub-expression context if they are not global
    Object.assign(subJexl.grammar.functions, jexl.grammar.functions)
    Object.assign(subJexl.grammar.transforms, jexl.grammar.transforms)
    const results = await Promise.all(val.map((item) => subJexl.eval(expr, item)))
    return results
  })
  jexl.addTransform('filter', async (val: any[], expr: any) => {
    const subJexl = new Jexl()
    Object.assign(subJexl.grammar.functions, jexl.grammar.functions)
    Object.assign(subJexl.grammar.transforms, jexl.grammar.transforms)
    const results = await Promise.all(val.map((item) => subJexl.eval(expr, item)))
    return val.filter((_, i) => results[i])
  })

  console.log('=== Real-world Use Cases Examples ===\n')

  // E-commerce Product Catalog
  const ecommerceData = {
    products: [
      {
        id: 'P001',
        name: 'Premium Laptop',
        price: 1299.99,
        category: 'Electronics',
        brand: 'TechBrand',
        rating: 4.8,
        reviews: 245,
        inStock: true,
        tags: ['gaming', 'work', 'portable'],
        specs: { ram: 16, storage: 512, processor: 'Intel i7' },
        discount: 0.1,
      },
      {
        id: 'P002',
        name: 'Wireless Headphones',
        price: 199.99,
        category: 'Electronics',
        brand: 'AudioTech',
        rating: 4.5,
        reviews: 89,
        inStock: true,
        tags: ['music', 'wireless', 'noise-canceling'],
        specs: { battery: 30, wireless: true, noiseCanceling: true },
        discount: 0.15,
      },
      {
        id: 'P003',
        name: 'Office Chair',
        price: 349.99,
        category: 'Furniture',
        brand: 'ComfortPlus',
        rating: 4.3,
        reviews: 156,
        inStock: false,
        tags: ['office', 'ergonomic', 'adjustable'],
        specs: { material: 'leather', adjustable: true, warranty: 5 },
        discount: 0.05,
      },
    ],
    filters: {
      category: 'Electronics',
      minPrice: 100,
      maxPrice: 1500,
      inStock: true,
      minRating: 4.0,
    },
    user: {
      id: 'U001',
      preferences: ['gaming', 'wireless'],
      budget: 800,
      member: true,
    },
  }

  // Product Filtering and Search
  console.log('--- E-commerce Product Filtering ---')

  // Dynamic product filtering
  console.log(
    'Filtered products:',
    await jexl.eval(
      `
      products[
        .category == filters.category && 
        .price >= filters.minPrice && 
        .price <= filters.maxPrice && 
        .inStock == filters.inStock && 
        .rating >= filters.minRating
      ]
    `,
      ecommerceData
    )
  )

  // Price calculation with discounts
  jexl.addTransform('finalPrice', (price: number, discount: number) => Math.round(price * (1 - discount) * 100) / 100)
  jexl.addFunction('formatProducts', (products: any[]) => {
    return products.map((p: any) => {
      const finalPrice = Math.round(p.price * (1 - p.discount) * 100) / 100
      return {
        id: p.id,
        name: p.name,
        originalPrice: p.price,
        finalPrice,
        savings: p.price - finalPrice,
      }
    })
  })

  console.log('Products with final prices:', await jexl.eval('formatProducts(products)', ecommerceData))

  // Personalized recommendations
  jexl.addFunction('getRecommendations', (products: any[], user: any) => {
    return products
      .filter(
        (p: any) =>
          p.price <= user.budget && user.preferences.some((pref: string) => p.tags.includes(pref)) && p.rating >= 4.0
      )
      .map((p: any) => {
        const finalPrice = Math.round(p.price * (1 - p.discount) * 100) / 100
        return {
          name: p.name,
          price: finalPrice,
          matchedTags: p.tags.filter((tag: string) => user.preferences.includes(tag)),
        }
      })
  })
  console.log('Personalized recommendations:', await jexl.eval('getRecommendations(products, user)', ecommerceData))
  console.log()

  // Employee HR System
  const hrData = {
    employees: [
      {
        id: 'E001',
        name: 'Alice Johnson',
        department: 'Engineering',
        position: 'Senior Developer',
        salary: 95000,
        startDate: '2022-03-15',
        skills: ['JavaScript', 'Python', 'React', 'AWS'],
        certifications: ['AWS Certified', 'React Expert'],
        performance: [
          { year: 2023, rating: 4.8, goals: 8, achieved: 7 },
          { year: 2024, rating: 4.9, goals: 6, achieved: 6 },
        ],
        benefits: { healthInsurance: true, retirement401k: true, paidTimeOff: 25 },
      },
      {
        id: 'E002',
        name: 'Bob Smith',
        department: 'Marketing',
        position: 'Marketing Manager',
        salary: 75000,
        startDate: '2021-08-20',
        skills: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
        certifications: ['Google Analytics', 'HubSpot Certified'],
        performance: [
          { year: 2023, rating: 4.5, goals: 10, achieved: 8 },
          { year: 2024, rating: 4.7, goals: 8, achieved: 7 },
        ],
        benefits: { healthInsurance: true, retirement401k: false, paidTimeOff: 20 },
      },
    ],
    company: {
      currentYear: 2024,
      budgetPerEmployee: 5000,
      performanceThreshold: 4.5,
    },
  }

  console.log('--- HR Management System ---')

  // Employee performance analysis
  jexl.addFunction('yearsOfService', (startDate: string, currentYear: number) => {
    const start = new Date(startDate)
    return currentYear - start.getFullYear()
  })

  jexl.addFunction('calculateRaise', (currentSalary: number, performance: number, yearsOfService: number) => {
    let raisePercent = 0
    if (performance >= 4.8) raisePercent = 0.08
    else if (performance >= 4.5) raisePercent = 0.05
    else if (performance >= 4.0) raisePercent = 0.03

    // Bonus for long service
    if (yearsOfService >= 5) raisePercent += 0.01

    return Math.round(currentSalary * raisePercent)
  })

  jexl.addFunction('summarizePerformance', (employees: any[], company: any) => {
    return employees.map((e: any) => {
      const lastPerf = e.performance[e.performance.length - 1]
      const years = company.currentYear - new Date(e.startDate).getFullYear()
      return {
        name: e.name,
        department: e.department,
        yearsOfService: years,
        currentRating: lastPerf.rating,
        goalCompletion: (lastPerf.achieved / lastPerf.goals) * 100,
        recommendedRaise: (jexl as any).grammar.functions.calculateRaise(e.salary, lastPerf.rating, years),
      }
    })
  })

  console.log('Employee performance summary:', await jexl.eval('summarizePerformance(employees, company)', hrData))

  // Skills gap analysis
  jexl.addFunction('createSkillsInventory', (employees: any[]) => {
    const allSkills = employees.flatMap((e) => e.skills)
    const uniqueSkills = [...new Set(allSkills)]
    return uniqueSkills.map((skill) => {
      const employeesWithSkill = employees.filter((e) => e.skills.includes(skill))
      return {
        skill,
        employeeCount: employeesWithSkill.length,
        departments: [...new Set(employeesWithSkill.map((e) => e.department))],
      }
    })
  })
  console.log('Skills inventory:', await jexl.eval('createSkillsInventory(employees)', hrData))
  console.log()

  // Financial Report Generation
  const financialData = {
    transactions: [
      { id: 'T001', date: '2024-01-15', amount: 25000, type: 'revenue', category: 'sales', department: 'Sales' },
      {
        id: 'T002',
        date: '2024-01-16',
        amount: -3500,
        type: 'expense',
        category: 'marketing',
        department: 'Marketing',
      },
      {
        id: 'T003',
        date: '2024-01-17',
        amount: 18000,
        type: 'revenue',
        category: 'services',
        department: 'Consulting',
      },
      { id: 'T004', date: '2024-01-18', amount: -1200, type: 'expense', category: 'office', department: 'Operations' },
      { id: 'T005', date: '2024-01-19', amount: -8500, type: 'expense', category: 'salaries', department: 'HR' },
    ],
    budgets: {
      sales: 100000,
      marketing: 15000,
      operations: 25000,
      consulting: 80000,
    },
    targets: {
      monthlyRevenue: 150000,
      profitMargin: 0.25,
    },
  }

  console.log('--- Financial Reporting ---')

  // Revenue and expense analysis
  jexl.addFunction('formatCurrency', (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  )

  jexl.addFunction('getFinancialSummary', (transactions: any[]) => {
    const totalRevenue = transactions.filter((t) => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    const netIncome = totalRevenue + totalExpenses
    return {
      totalRevenue,
      totalExpenses: totalExpenses * -1,
      netIncome,
      transactionCount: transactions.length,
      avgTransactionSize: netIncome / transactions.length,
    }
  })

  console.log('Financial summary:', await jexl.eval('getFinancialSummary(transactions)', financialData))

  // Department spending analysis
  jexl.addFunction('analyzeSpending', (transactions: any[]) => {
    const spending = transactions.filter((t) => t.type === 'expense')
    const depts = [...new Set(spending.map((t) => t.department))]
    return depts.map((dept) => {
      const deptTxns = spending.filter((t) => t.department === dept)
      const spent = deptTxns.reduce((sum, t) => sum + t.amount, 0) * -1
      return {
        department: dept,
        spent,
        transactions: deptTxns.length,
        avgExpense: spent / deptTxns.length,
      }
    })
  })
  console.log('Department spending analysis:', await jexl.eval('analyzeSpending(transactions)', financialData))
  console.log()

  // Data Validation System
  const validationData = {
    userRegistrations: [
      {
        email: 'alice@example.com',
        age: 28,
        password: 'SecurePass123!',
        phone: '+1-555-0123',
        country: 'US',
        agreeToTerms: true,
      },
      {
        email: 'invalid-email',
        age: 16,
        password: '123',
        phone: '555-0124',
        country: 'CA',
        agreeToTerms: false,
      },
      {
        email: 'bob@company.org',
        age: 35,
        password: 'MyPassword456',
        phone: '+44-20-1234-5678',
        country: 'UK',
        agreeToTerms: true,
      },
    ],
  }

  console.log('--- Data Validation ---')

  // Validation rules
  jexl.addFunction('isValidEmail', (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  })

  jexl.addFunction('isStrongPassword', (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    )
  })

  jexl.addFunction('isValidPhone', (phone: string) => {
    const phoneRegex = /^[\\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[-\s\\(\\)]/g, ''))
  })

  jexl.addFunction('validateUser', (user: Record<string, unknown>) => {
    const errors: string[] = []

    if (!jexl.grammar.functions.isValidEmail(user.email as string)) {
      errors.push('Invalid email format')
    }

    if ((user.age as number) < 18) {
      errors.push('User must be at least 18 years old')
    }

    if (!jexl.grammar.functions.isStrongPassword(user.password as string)) {
      errors.push('Password does not meet security requirements')
    }

    if (!jexl.grammar.functions.isValidPhone(user.phone as string)) {
      errors.push('Invalid phone number format')
    }

    if (!user.agreeToTerms) {
      errors.push('Must agree to terms and conditions')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  })

  jexl.addFunction('getValidationResults', (users: any[]) => {
    return users.map((user: any) => ({
      email: user.email,
      validation: (jexl as any).grammar.functions.validateUser(user),
    }))
  })

  console.log('User validation results:', await jexl.eval('getValidationResults(userRegistrations)', validationData))

  // Bulk validation summary
  jexl.addFunction('getValidationSummary', (users: any[]) => {
    const validationResults = users.map((u: any) => (jexl as any).grammar.functions.validateUser(u))
    const commonErrors = validationResults
      .flatMap((v: any) => v.errors)
      .reduce((acc: any, error: any) => {
        acc[error] = (acc[error] || 0) + 1
        return acc
      }, {})

    return {
      totalUsers: users.length,
      validUsers: validationResults.filter((v: any) => v.isValid).length,
      invalidUsers: validationResults.filter((v: any) => !v.isValid).length,
      commonErrors,
    }
  })
  console.log('Validation summary:', await jexl.eval('getValidationSummary(userRegistrations)', validationData))
  console.log()

  // Business Rules Engine
  const orderData = {
    order: {
      id: 'ORD-2024-001',
      customerId: 'C001',
      items: [
        { productId: 'P001', quantity: 2, unitPrice: 299.99 },
        { productId: 'P002', quantity: 1, unitPrice: 149.99 },
      ],
      shippingAddress: {
        country: 'US',
        state: 'CA',
        zipCode: '90210',
      },
      customer: {
        type: 'premium',
        loyaltyPoints: 1500,
        previousOrders: 12,
      },
    },
    businessRules: {
      freeShippingThreshold: 500,
      taxRates: { CA: 0.0875, NY: 0.08, TX: 0.0625 },
      discounts: {
        premium: 0.1,
        loyalty: 0.05,
        bulk: 0.15,
      },
    },
  }

  console.log('--- Business Rules Engine ---')

  // Order processing rules
  jexl.addFunction('calculateSubtotal', (items: { quantity: number; unitPrice: number }[]) =>
    items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  )

  jexl.addFunction(
    'calculateTax',
    (subtotal: number, state: string, taxRates: Record<string, number>) => subtotal * (taxRates[state] || 0)
  )

  jexl.addFunction(
    'applyDiscounts',
    (subtotal: number, customer: Record<string, unknown>, rules: Record<string, unknown>) => {
      let discount = 0
      const discountRules = rules.discounts as Record<string, number>

      // Premium customer discount
      if (customer.type === 'premium') {
        discount += discountRules.premium
      }

      // Loyalty points discount
      if ((customer.loyaltyPoints as number) > 1000) {
        discount += discountRules.loyalty
      }

      // Bulk order discount
      if (subtotal > 1000) {
        discount += discountRules.bulk
      }

      return Math.min(discount, 0.3) // Cap at 30%
    }
  )

  console.log(
    'Order processing:',
    await jexl.eval(
      `
      {
        orderId: order.id,
        subtotal: calculateSubtotal(order.items),
        discountRate: applyDiscounts(
          calculateSubtotal(order.items), 
          order.customer, 
          businessRules
        ),
        discountAmount: calculateSubtotal(order.items) * applyDiscounts(
          calculateSubtotal(order.items), 
          order.customer, 
          businessRules
        ),
        taxableAmount: calculateSubtotal(order.items) * (1 - applyDiscounts(
          calculateSubtotal(order.items), 
          order.customer, 
          businessRules
        )),
        tax: calculateTax(
          calculateSubtotal(order.items) * (1 - applyDiscounts(
            calculateSubtotal(order.items), 
            order.customer, 
            businessRules
          )),
          order.shippingAddress.state,
          businessRules.taxRates
        ),
        freeShipping: calculateSubtotal(order.items) >= businessRules.freeShippingThreshold,
        shippingCost: calculateSubtotal(order.items) >= businessRules.freeShippingThreshold ? 0 : 15.99
      }
    `,
      orderData
    )
  )
  console.log()
}

// Run the examples
realWorldUseCases().catch(console.error)
