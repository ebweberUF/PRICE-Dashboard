import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicTable from "@/app/components/utilities/BasicTable/page";
import StripedRowTable from "@/app/components/utilities/StripedRowTable/page";
import HoverTable from "@/app/components/utilities/HoverTable/page";
import CheckboxTable from "@/app/components/utilities/CheckboxTable/page";
import DataTable from "@/app/components/utilities/DataTable/page";
import { EmployeesData } from "@/app/components/utilities/data";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Table",
  },
];

function page() {
  return (
    <>
      <BreadcrumbComp title="Table" items={BCrumb} />
      <div className="flex gap-6 flex-col ">
        <DataTable data={EmployeesData} />
        <BasicTable />
        <StripedRowTable />
        <HoverTable />
        <CheckboxTable />
      </div>
    </>
  );
}

export default page;
