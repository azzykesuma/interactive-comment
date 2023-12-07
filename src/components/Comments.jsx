import React from 'react'
// util
import Image from 'next/image';
import ScoreCounter from './ScoreCounter';
function Comments(props) {
  const {item, incrementScore,decrementScore, user, isReply, deleteComment,replyComment,editComment} = props;
  const isReplyClass = 'bg-white rounded-lg p-3 mb-5 w-[95%] ml-auto my-3 md:grid md:grid-cols-[10%_90%] '
  const normalClass = 'bg-white rounded-lg p-3 mb-5 my-3 md:grid md:grid-cols-[10%_90%]'

  function renderButton() {
    return (
    user.username !== item.user.username ? (
      <>
          <button onClick={() => replyComment(item.id, item)} className='flex items-center gap-3 ml-auto hover:opacity-50'>
              <Image src={'/images/icon-reply.svg'} width={15} height={15} alt='icon-reply' />
              reply
          </button>
      </>
  ) : (
      <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
              <button onClick={() => deleteComment(item.id)} className='text-Soft-Red font-bold text-sm flex items-center gap-2 hover:opacity-50 transition-all'>
              <Image src={'/images/icon-delete.svg'} width={15} height={15} alt='icon-delete' />
              Delete
              </button> 
          </div>
          <div className='flex items-center gap-2'>
              <button onClick={() => editComment(item)} className='text-Dark-blue font-bold text-sm flex items-center gap-2 hover:opacity-50 transition-all'>
              <Image src={'/images/icon-edit.svg'} width={15} height={15} alt='icon-delete' />
              Edit
              </button>
          </div>
      </div>
  ))}
  return (
    <div className={isReply ? isReplyClass : normalClass}>
      <div className='flex gap-5 items-center mb-3 md:col-[2/-1]'>
        {/* header card */}
        {item.user ? (
            <>
                <Image src={item.user.image.webp} height={30} width={30} className='rounded' alt={item.user.username} />
                <p className='text-Dark-blue font-bold text-sm'>{item.user.username}</p>
                <p className='text-Grayish-Blue text-sm'>{item.createdAt}</p>
            </>
        ) : null}
        <div className='hidden md:block ml-auto'>{renderButton()}</div>
      </div>
      {/* content */}
      <p className='text-Grayish-Blue font-medium text-sm leading-6 md:col-[2/-1]'>{isReply ? (
        <>
            <span className='font-bold text-Moderate-blue'>@{item.user.username}</span>
            <span className='inline'> {item.content}</span>
        </>
      ) : item.content}</p>
      {/* footer */}
      <div className='flex justify-between mt-3 md:row-[1/-3] md:pb-5'>
        <ScoreCounter incrementScore={incrementScore} decrementScore={decrementScore} score={item.score} id={item.id} />
        <div className='md:hidden'>{renderButton()}</div>
      </div>
    </div>
  )
}

export default Comments
