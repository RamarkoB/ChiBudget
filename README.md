# Welcome to the Chicago Budget Dashboard Project
Our goal is to consolidate the different City-Published Tableau Data visualizations into a single, consolidated source to better understand the Chicago Budget


## Existing Sources and Visualizations
- [Budget Transfers](https://data.cityofchicago.org/Administration-Finance/Budget-Transfer-Report-Source-Data/7x7d-3zgj/data_preview)
- [Budget Publications](https://www.chicago.gov/city/en/depts/obm/provdrs/budget/svcs/BudgetPublications.html)
- [Information from the Office of the Inspector General (Removed)](https://igchicago.org/information-portal/data-dashboards/city-budget-by-departments/)
- [Chicago 2026 Budget at a Glance](https://public.tableau.com/app/profile/obm.data.analytics/viz/CityofChicago-BudgetataGlance/ChicagoBudgetataGlance?publish=yes)
- [FY26 Budget Ordinance Dashboard](https://www.chicago.gov/city/en/depts/cofa/supp_info/COFAdata/2026BudgetOrdinance.html)
- [ACFR Analysis FY2025](https://www.chicago.gov/city/en/depts/cofa/supp_info/BudgetAnalysis/ACFRAnalysisFY2025.html)


# Definitions

## From Office of Inspector General

Local funds are used by the City for non-capital operations with sources other
than grant funds. These include the Corporate Fund, O’Hare Revenue Fund, Water
Fund, and other similar funds. Grants are financial awards given by the federal,
state, or local government authority restricted for a specific project or
service. Community Development Block Grant (CDBG) funds are provided by federal
and state governments to communities and people to be used in a variety of ways
including housing, community development programs, healthy food initiatives, and
sustainability services.

## From 2026 Budget-at-a-Glance

- Proceeds of debt issuances transferred between funds and reimbursements or
  internal transfers between funds need to be deducted to more accurately
  reflect the City appropriation.
- Total resources include revenues generated during the year.

# Fund Categories
There are Six Major Funds in the City of Chicago:
- The Corporate Fund (Code `0100`)
- The Enterprise Fund, which consists of: 
  - 
- The Special Revenue Fund, which consists of:
  - VehicleTaxFund
  - MotorFuelTaxFund
  - GarbageFeeFund
  - SpecialEvents&HotelTaxFund
  - LibraryFund

The Fund matches were determined from the [2026 Budget Overview](https://www.chicago.gov/content/dam/city/depts/obm/supp_info/Quarterly%20Budget%20Report/2026/2026_Q1_QBR_City-of-Chicago.pdf) and the [Office of Budget and Management FAQ](https://www.chicago.gov/city/en/depts/obm/supp_info/faq.html)

# Notes
- In 2019, Mayor Lightfoot merged the Department of Innovation and Technology with Fleet and Facility Management. This merger was undone by Brandon Johnson. [1](https://derekeder.com/blog/doit-2fm-merger-questions)

# Outstanding Tasks

## Outstanding Data Tasks:

- Find Debt Issuances and Internal Transfers
- Finding Definitions for Appropriation Authorities
- Start Analysis of Budget Recommendations
- Compare Budget Recommendations vs Ordinance

## Outstanding Data Viz Tasks:

- Designing Condensed Sankey/Alluvial Diagrams
- Redesigning Bar Charts from Inspector General Office as Pie/Donut Graphs
- Implement Visuals from Budget Breakdown Overview
