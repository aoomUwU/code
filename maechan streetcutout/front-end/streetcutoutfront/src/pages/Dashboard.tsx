import useSWR from 'swr';
import { FrappeContext, FrappeConfig } from "frappe-react-sdk";
import { useContext, useEffect, useState } from 'react';
import { DashboardData } from "../interfaces";

function Dashboard() {
  const [IMG, setIMG] = useState<DashboardData[]>([]);

  const { call } = useContext(FrappeContext) as FrappeConfig;
  const fetcher = (url: string) => call.get(url).then((res) => res.message.data); // เข้าถึง data array

  const { data: img, error: imgError, isLoading: imgloading } = useSWR(
    "maechan.maechan_streetcutout.doctype.dashboardimg.dashboardimg.load_dashboard_imgs",
    fetcher
  );
  console.log(img)
  useEffect(() => {
    if (img) {
      setIMG(img);
      console.log("Fetched images:", img);
    }
  }, [img]);

  useEffect(() => {
    console.log("IMG state:", IMG);
  }, [IMG]);

  return (
    <div className='flex flex-col flex-auto mb-5'>
      <ul>
        <h1 className='p-5 text-xl font-bold tracking-widest text-white bg-custom-gradient rounded mb-5'>
          ติดต่อสอบถามภาษีป้าย
        </h1>
        <li className='flex flex-col flex-wrap mb-8'>
          <h1 className='text-xl font-sans tracking-wide text-black text-center mb-3'>
            เทศบาลแม่จัน
          </h1>
          <h2 className='text-base font-sans tracking-wide text-black text-center'>
            555 หมู่ 4 ถนนพหลโยธิน ตำบลแม่จัน อำเภอแม่จัน จังหวัดเชียงราย
          </h2>
          <h2 className='text-base font-sans tracking-wide text-black text-center'>
            โทร. 0-5377-1222 โทรสาร 0-5377-2565
          </h2>
          <h2 className='text-base font-sans tracking-wide text-black text-center'>
            Email : maechan.md@gmail.com
          </h2>
          <h2 className='text-base font-sans tracking-wide text-black text-center'>
            Email : saraban@maechan.go.th
          </h2>
        </li>
      </ul>

      <div className='container  px-4 mb-6 border-gray-200'>
        <h1 className='flex flex-col font-semibold mb-4 text-center'>การเก็บภาษีป้าย</h1>
        <div className='flex flex-auto justify-center mb-3'>
          {imgloading ? (
            <p>กำลังโหลด.....</p>
          ) : (
            IMG.map((imgData: DashboardData) => (
              <img
                src={'http://maechandev.chaowdev.xyz:8001/' + imgData.dashboard_img}
                alt=""
                className="max-h-unit-7xl "
              />
            ))
          )}
        </div>
      </div>
      <div className='flex flex-col p-5 mb-3'>
          <h1 className='flex flex-col font-semibold'>
          ป้ายกองโจร ป้ายติดตั้งชั่วคราว 
          </h1>
          <p className='flex flex-auto mb-3'>
          การขออนุญาตโฆษณา ปิด ทิ้ง หรือโปรยแผ่นประกาศ หรือใบปลิว โดยป้ายจะต้องเป็นลักษณะป้ายชั่วคราว มีขนาดเดียวคือ 1.20 x 2.40 เซนติเมตร เพื่อความสะอาดและเป็นระเบียบเรียบร้อยของบ้านเมือง โดยมีขั้นตอนการขออนุญาต ดังนี้
          </p>
          <ul>
        <li className='flex flex-col flex-wrap mb-8'>
          <h2 className='text-base font-sans tracking-wide text-black text-left'>
          1. ยื่นหนังสือขออนุญาตต่อนายกเทศมนตรี พร้อมแนบแบบโฆษณา 
          </h2>
          <h2 className='text-base font-sans tracking-wide text-black text-left'>
          2. เขียนคำร้อง (แบบ ร.ส.1) ที่งานรักษาความสงบ สำนักปลัดเทศบาล หรือผ่าน online ได้ภายในเว็บไซต์นี้
          </h2>
          <h2 className='text-base font-sans tracking-wide text-black text-left mb-4'>
          3. เมื่อผ่านการอนุญาต ให้ชำระค่าธรรมเนียมป้ายละ 200 บาท โดยเจ้าหน้าที่จะออกใบเสร็จรับเงินไว้เป็นหลักฐาน
          </h2>
          <h3 className='text-base font-sans tracking-wide text-red-600 text-left'>
           *ทั้งนี้ สถานที่ในการติดตั้งป้ายโฆษณา ห้ามติดตั้งบริเวณคร่อมทางสาธารณะ วงเวียน สะพานลอย เกาะกลางถนน สวนหย่อม สวนสาธารณะ ถนน ต้นไม้ ที่สาธารณะ และเสาไฟฟ้าซึ่งเป็นทรัพย์สินของการไฟฟ้า จะไม่อนุญาตให้ติดตั้ง โดยเมื่อครบกำหนดเวลาตามที่ระบุไว้ในหนังสือแล้ว ให้ทำการรื้อถอนป้ายทันที ทั้งนี้ ระยะติดตั้งได้ไม่เกิน 1 เดือน
          </h3>
        </li>
      </ul>
      </div>
    </div>
  );
}

export default Dashboard;
