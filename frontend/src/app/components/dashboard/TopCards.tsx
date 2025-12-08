"use client"

import Link from "next/link"
import CardBox from "../shared/CardBox"
import { Icon } from "@iconify/react"

const TopCards = () => {

  const TopCardInfo = [
    {
      key: "card1",
      title: "Active Labs",
      desc: "3",
      icon: "solar:test-tube-bold",
      bgcolor: "bg-primary/10 dark:bg-primary/10",
      textclr: "text-primary dark:text-primary",
      url: "/labs"
    },
    {
      key: "card2",
      title: "Active Studies",
      desc: "7",
      icon: "solar:clipboard-list-bold",
      bgcolor: "bg-success/10 dark:bg-success/10",
      textclr: "text-success dark:text-success",
      url: "/studies"
    },
    {
      key: "card3",
      title: "Participants",
      desc: "142",
      icon: "solar:users-group-rounded-bold",
      bgcolor: "bg-secondary/10 dark:bg-secondary/10",
      textclr: "text-secondary dark:text-secondary",
      url: "/participants"
    },
    {
      key: "card4",
      title: "Data Completeness",
      desc: "87%",
      icon: "solar:chart-square-bold",
      bgcolor: "bg-warning/10 dark:bg-warning/10",
      textclr: "text-warning dark:text-warning",
      url: "/data-quality"
    },
  ]


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {
          TopCardInfo.map((item) => {
            return (
              <Link href={item.url} key={item.key}>
                <CardBox className={`shadow-none ${item.bgcolor} w-full border-none! hover:scale-105 transition-all ease-in-out`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${item.bgcolor}`}>
                      <Icon icon={item.icon} height={32} width={32} className={item.textclr} />
                    </div>
                    <div>
                      <p className="text-bodytext dark:text-darklink text-sm mb-1">
                        {item.title}
                      </p>
                      <h4 className={`text-2xl font-bold ${item.textclr} mb-0`}>{item.desc}</h4>
                    </div>
                  </div>
                </CardBox>
              </Link>
            )
          })
        }
      </div>
    </>
  )
}
export { TopCards }
