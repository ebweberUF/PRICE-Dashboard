import React from "react";
import { TopCards } from "../components/dashboard/TopCards";
import ProfileWelcome from "../components/dashboard/ProfileWelcome";
import { RecentStudies } from "../components/dashboard/RecentStudies";
import { QuickActions } from "../components/dashboard/QuickActions";
import { DataQualityOverview } from "../components/dashboard/DataQualityOverview";
import { Footer } from "../components/dashboard/Footer";

const page = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <ProfileWelcome />
        </div>
        <div className="col-span-12">
          <TopCards />
        </div>
        <div className="lg:col-span-8 col-span-12">
          <RecentStudies />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <QuickActions />
        </div>
        <div className="col-span-12">
          <DataQualityOverview />
        </div>
        <div className="col-span-12">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default page;
