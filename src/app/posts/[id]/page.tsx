import React from 'react'
import { app } from "./../../../firebase"
import { DocumentData, doc, getDoc, getFirestore } from 'firebase/firestore'
import { HiDotsHorizontal } from 'react-icons/hi'
import { IoMdArrowRoundBack } from "react-icons/io";
import Icons from '@/components/Icons';
import Comments from '@/components/Comments';

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const db = getFirestore(app)
  let data: DocumentData = {}

  const querySnapshot = await getDoc(doc(db, 'posts', id))
  data = { ...querySnapshot.data(), id: querySnapshot.id }

  const { seconds, nanoseconds } = data.timestamp;
  const date = new Date(seconds * 1000 + nanoseconds / 1000000);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Months are zero-based
  const year = date.getUTCFullYear()
  // console.log(day, month, year);
  return (
    <>
      <div className='p-2 border-b'>
        <div className='flex gap-4 items-center'>
          <IoMdArrowRoundBack className='text-2xl' />
          <h1 className='text-xl font-bold'>Post</h1>
        </div>
        <div className='mt-5 flex p-3 border-gray-300 duration-100 pb-1'>
          <img src={data?.profileImg} alt="" className='h-11 w-11 rounded-full mr-2' />
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1 whitespace'>
                <h4 className='font-bold text-sm truncate'>
                  {data?.name}
                </h4>
                <span className='text-xs truncate'>
                  @{data?.username}
                </span>
              </div>
              <HiDotsHorizontal className='text-sm' />
            </div>
            <p className='text-gray-800 text-sm my-3'>{data?.text}</p>
            {data?.image &&
              <img src={data?.image} alt="pos-img" className='rounded-2xl mr-2 ' />
            }
            <div className='border-t border-b border-gray-300 py-2 mb-2'>
              <span className='text-sm text-gray-600'>{day}/{month}/{year}</span>
            </div>
            <Icons id={data?.id} uid={data?.uid} />
          </div>
        </div>
      </div>
      <Comments id={id}/>
    </>
  )
}

export default page