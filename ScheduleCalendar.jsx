import * as React from "react";
import styled from "styled-components";
import moment from "moment";
import prev_arrow from "../../assets/img/prev_arrow.svg";
import next_arrow from "../../assets/img/next_arrow.svg";
import { dashboardDataSet } from "../../assets/data/dummy/dashboard";
import { changeUTCtime } from "../../utils/convertData";

const Styled = {
  ScheduleCalendar: styled.div`
    overflow: auto;
    margin: 0 auto;
    width: ${(props) => props.width};
    height: ${(props) => props.height};

    .change-day {
      display: flex;
      justify-content: center;
      align-items: center;

      .current-day {
        margin: 0 32px;
        font-size: 1.13rem;
      }

      & > button {
        width: 32px;
        height: 32px;
        border: 1px solid #939393;
        border-radius: 8px;
        cursor: pointer;
      }

      & > .prev {
        background: url(${prev_arrow}) no-repeat center;
        transform: rotate(-90deg);
      }

      & > .next {
        background: url(${next_arrow}) no-repeat center;
        transform: rotate(-90deg);
      }
    }
  `,
  Table: styled.table`
    width: 100%;
    text-align: center;
    margin-top: 32px;

    th {
      width: calc(100% / 7);
      color: #939393;
      font-size: 0.75rem;
    }

    td {
      cursor: pointer;
      span {
        position: relative;
        display: inline-block;
        width: 38px;
        height: 48px;
        line-height: 48px;
        border-radius: 10px;
        font-size: 1rem;
      }

      .schedule:after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 8px;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #5786ed;
      }

      .select {
        background-color: #5786ed;
        color: #fff;

        &.schedule:after {
          background-color: #fff;
        }
      }

      .today.select {
        background-color: #5786ed;
        color: #fff;

        &.schedule:after {
          background-color: #fff;
        }
      }
    }
  `,
};

export default function ScheduleCalendar({
  width = "100%",
  height = "auto",
  getDate,
  getMonth,
  schedule = dashboardDataSet.scheduleData,
  selectDate,
  className,
}) {
  const [today, setToday] = React.useState(changeUTCtime(undefined, 0));

  const cloneToday = today.clone();
  const firstWeek = cloneToday.startOf("month").week(); //이번달의 첫 주 인덱스
  const lastWeek =
    cloneToday.endOf("month").week() === 1
      ? 53 // 1년의
      : cloneToday.endOf("month").week(); //이번달의 마지막 주 인덱스

  const dayOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const onClick = (day) => () => {
    const date = day.format("YYYY-MM-DD");
    getDate && getDate(date);
  };

  const checkSchedule = (day) => {
    const date = day.format("YYYY-MM-DD");
  };

  const calendarArr = () => {
    let result = [];
    let week = firstWeek;

    // 이번달 주차
    for (week; week <= lastWeek; week++) {
      result = result.concat(
        <tr key={week}>
          {Array(7)
            .fill(0)
            .map((data, index) => {
              // 이번달 일자
              let days = cloneToday
                .clone()
                .startOf("year")
                .week(week)
                .startOf("week")
                .add(index, "day"); //d로해도되지만 직관성

              const isToday =
                changeUTCtime(undefined, 0).format("YYYY-MM-DD") ===
                days.format("YYYY-MM-DD")
                  ? "today"
                  : "";
              const isSelect =
                selectDate === days.format("YYYY-MM-DD") ? "select" : "";

              const isSchedule = (function () {
                return schedule.includes(days.format("YYYY-MM-DD"))
                  ? "schedule"
                  : "";
              })();

              return days.format("MM") !== cloneToday.format("MM") ? (
                <td key={index}></td>
              ) : (
                <td key={index} onClick={onClick(days)}>
                  <span className={`${isToday} ${isSchedule} ${isSelect}`}>
                    {days.format("D")}
                  </span>
                </td>
              );
            })}
        </tr>
      );
    }
    return result;
  };

  const prevMonth = () => {
    setToday(cloneToday.subtract(1, "month"));
    getMonth(cloneToday.format("YYYY-MM-DD"));
  };

  const nextMonth = () => {
    setToday(cloneToday.add(1, "month"));
    getMonth(cloneToday.format("YYYY-MM-DD"));
  };

  React.useEffect(() => {}, [today]);

  return (
    <Styled.ScheduleCalendar
      width={width}
      height={height}
      className={className}
    >
      <div className="change-day">
        <button className="prev" onClick={prevMonth}></button>
        <span className="current-day">{cloneToday.format("MMM YYYY")}</span>
        <button className="next" onClick={nextMonth}></button>
      </div>
      <Styled.Table>
        <thead>
          <tr>
            {dayOfWeek.map((dow, idx) => {
              return <th key={idx}>{dow}</th>;
            })}
          </tr>
        </thead>
        <tbody>{calendarArr()}</tbody>
      </Styled.Table>
    </Styled.ScheduleCalendar>
  );
}
