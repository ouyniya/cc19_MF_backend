const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const fundController = {};

fundController.getAllFundNames = async (req, res, next) => {
  try {
    const { classAbbrName } = req.query;
    // console.log(classAbbrName)

    if (!classAbbrName) {
      return res.json({ result: [] });
    }

    let result = await prisma.classAbbr.findMany({
      where: {
        classAbbrName: { contains: classAbbrName },
      },

      select: {
        classAbbrName: true,
      },
      take: 10,
    });

    res.json({ result });
  } catch (error) {
    next(error);
  }
};

fundController.getCompany = async (req, res, next) => {
  try {
    const result = await prisma.company.findMany({
      select: {
        id: true,
        companyName: true,
      },
    });
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

fundController.getRiskLevel = async (req, res, next) => {
  try {
    const result = await prisma.fundRiskLevel.findMany({
      select: {
        id: true,
        fundRiskLevelName: true,
      },
    });
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

fundController.getFundGroup = async (req, res, next) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT DISTINCT fund_compare_group as fundCompareGroup
    FROM funds;
  `;

    if (result.length === 0) {
      return res.status(404).json({ message: "No fund groups found" });
    }

    res.json({ result });
  } catch (error) {
    next(error);
  }
};

fundController.getGlobalInv = async (req, res, next) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT DISTINCT invest_country_flag as investCountryFlag
    FROM funds;
  `;

    if (result.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json({ result });
  } catch (error) {
    next(error);
  }
};

// {{url}}/funds/filter?classAbbrName=&companyId=&fundCompareGroup=&fundRiskLevelId=&investCountryFlag=&dividendPolicy=N&page=2
fundController.getFunds = async (req, res, next) => {
  try {
    const {
      classAbbrName,
      companyId,
      fundCompareGroup,
      fundRiskLevelId,
      investCountryFlag,
      dividendPolicy,
      page = "1",
      limit = "10",
    } = req.query;

    // console.log(typeof classAbbrName)
    // filter by performance , fundrisklevel, fee

    let result = [];
    // validate
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
      return createError(400, "invalid type for page or limit");
    }

    const skip = (Number(page) - 1) * Number(limit);

    // filter from db
    // if no data input >> show all funds

    result = await prisma.classAbbr.findMany({
      where: {
        AND: {
          classAbbrName: !!classAbbrName
            ? {
                contains: classAbbrName,
              }
            : {},
          dividendPolicy: !!dividendPolicy ? dividendPolicy : {},
        },
        funds: {
          AND: {
            fundCompareGroup: !!fundCompareGroup ? fundCompareGroup : {},
            fundRiskLevelId: !!Number(fundRiskLevelId)
              ? Number(fundRiskLevelId)
              : {},
            investCountryFlag: !!investCountryFlag ? investCountryFlag : {},
          },
          companies: {
            id: !!Number(companyId) ? Number(companyId) : {},
          },
        },
      },
      include: {
        funds: {
          include: {
            companies: {
              select: {
                companyName: true,
              },
            },
          },
        },
        FeeDetial: {
          where: {
            feeType: "ค่าธรรมเนียมและค่าใช้จ่ายรวมทั้งหมด",
          },
          select: {
            feeType: true,
            rate: true,
            rateUnit: true,
            actualValue: true,
          },
        },
        fundPerformanceRisk: true,
      },
      skip: skip,
      take: Number(limit),
      orderBy: {},
    });

    countAllResult = await prisma.classAbbr.count({
      where: {
        AND: {
          classAbbrName: !!classAbbrName
            ? {
                contains: classAbbrName,
              }
            : {},
          dividendPolicy: !!dividendPolicy ? dividendPolicy : {},
        },
        funds: {
          AND: {
            fundCompareGroup: !!fundCompareGroup ? fundCompareGroup : {},
            fundRiskLevelId: !!Number(fundRiskLevelId)
              ? Number(fundRiskLevelId)
              : {},
            investCountryFlag: !!investCountryFlag ? investCountryFlag : {},
          },
          companies: {
            id: !!Number(companyId) ? Number(companyId) : {},
          },
        },
      },
    });

    // console.log(result.length);

    res.json({
      count: countAllResult,
      message: result,
    });
  } catch (error) {
    next(error);
  }
};

fundController.sortFunds = async (req, res, next) => {
  //1. ดึงข้อมูลมาก่อน (findMany)
  // 2. กรองค่า performance ที่ต้องการ
  // 3. เรียงลำดับใน JavaScript แล้ว slice ตามค่าของ skip และ limit

  try {
    // filtered variable
    const {
      classAbbrName,
      companyId,
      fundCompareGroup,
      fundRiskLevelId,
      investCountryFlag,
      dividendPolicy,
      page = "1",
      limit = "10",
      sortBy,
      performanceType,
      performancePeriod,
    } = req.query;

    // validate
    if (sortBy !== "fee") {
      if (!sortBy || !performanceType || !performancePeriod) {
        return createError(400, "กรุณาระบุค่าให้ครบถ้วน");
      }
    }

    if (typeof sortBy !== "string") {
      return createError(400, "ระบุวิธีการเรียงลำดับไม่ถูกต้อง");
    }

    if (performanceType && performancePeriod) {
      if (
        typeof performanceType !== "string" ||
        typeof performancePeriod !== "string"
      ) {
        return createError(400, "ระบุวิธีการเรียงลำดับไม่ถูกต้อง");
      }
    }

    let result = [];
    // validate
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
      return createError(400, "invalid type for page or limit");
    }

    const skip = (Number(page) - 1) * Number(limit);

    // filter from db
    // if no data input >> show all funds

    result = await prisma.classAbbr.findMany({
      where: {
        AND: {
          classAbbrName: !!classAbbrName
            ? {
                contains: classAbbrName,
              }
            : {},
          dividendPolicy: !!dividendPolicy ? dividendPolicy : {},
        },
        funds: {
          AND: {
            fundCompareGroup: !!fundCompareGroup ? fundCompareGroup : {},
            fundRiskLevelId: !!Number(fundRiskLevelId)
              ? Number(fundRiskLevelId)
              : {},
            investCountryFlag: !!investCountryFlag ? investCountryFlag : {},
          },
          companies: {
            id: !!Number(companyId) ? Number(companyId) : {},
          },
        },
      },
      include: {
        funds: {
          include: {
            companies: {
              select: {
                companyName: true,
              },
            },
          },
        },
        FeeDetial: {
          where: {
            feeType: "ค่าธรรมเนียมและค่าใช้จ่ายรวมทั้งหมด",
          },
          select: {
            feeType: true,
            rate: true,
            rateUnit: true,
            actualValue: true,
          },
        },
        fundPerformanceRisk: true,
      },
    });


    countAllResult = await prisma.classAbbr.count({
      where: {
        AND: {
          classAbbrName: !!classAbbrName
            ? {
                contains: classAbbrName,
              }
            : {},
          dividendPolicy: !!dividendPolicy ? dividendPolicy : {},
        },
        funds: {
          AND: {
            fundCompareGroup: !!fundCompareGroup ? fundCompareGroup : {},
            fundRiskLevelId: !!Number(fundRiskLevelId)
              ? Number(fundRiskLevelId)
              : {},
            investCountryFlag: !!investCountryFlag ? investCountryFlag : {},
          },
          companies: {
            id: !!Number(companyId) ? Number(companyId) : {},
          },
        },
      },
    });

    let sortResult = [];
    let finalResult = [];

    // sort by fee
    if (sortBy === "fee") {
      sortResult = result
        .filter((el) => {
          // filter เฉพาะอันที่มี fee นี้ ถ้าไม่มีไม่เอา
          let actualFee = el.FeeDetial[0]?.actualValue;
          return !(!actualFee && actualFee !== 0);
        })
        .sort((a, b) => {
          // เรียงจาก fee ต่ำไปสูง
          return a.FeeDetial[0].actualValue - b.FeeDetial[0].actualValue;
        });

      // ตัดข้อมูล
      finalResult = sortResult.slice(skip, skip + Number(limit));
    } else if (sortBy === "return") {
      // กรองเฉพาะค่าผลตอบแทนกองทุนรวมตาม period และเรียงลำดับ
      sortResult = result
        .map((item) => ({
          ...item,
          performanceValue:
            item.fundPerformanceRisk.find(
              (p) =>
                p.performanceType === performanceType &&
                p.performancePeriod === performancePeriod
            )?.performanceValue || -9999, // กรองเฉพาะค่า performance ที่ต้องการ
        }))
        .sort((a, b) => b.performanceValue - a.performanceValue); // เรียงจากมากไปน้อย

      // ตัดข้อมูล
      finalResult = sortResult.slice(skip, skip + Number(limit));

      console.log(finalResult);
    } else if (sortBy === "risk") {
      // กรองเฉพาะค่า sd กองทุนรวมตาม period และเรียงลำดับ
      sortResult = result
        .map((item) => ({
          ...item,
          performanceValue:
            item.fundPerformanceRisk.find(
              (p) =>
                p.performanceType === performanceType &&
                p.performancePeriod === performancePeriod
            )?.performanceValue || 9999, // กรองเฉพาะค่าที่ต้องการ
        }))
        .sort((a, b) => a.performanceValue - b.performanceValue); // เรียงจากน้อยไปมาก

      // ตัดข้อมูล
      finalResult = sortResult.slice(skip, skip + Number(limit));

      console.log(finalResult);
    }

    res.json({ 
      count: countAllResult,
      message: finalResult 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = fundController;
