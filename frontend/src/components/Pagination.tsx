import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from '../utils/usePagination';
import { Pagination } from 'react-bootstrap';
// import './pagination.scss';

export const MyPagination = (props: { 
    onPageChange: (page: number) => void,
    totalCount: number,
    siblingCount: number,
    currentPage: number,
    pageSize: number,
  }) => {

  const paginationRange = usePagination({
    currentPage: props.currentPage,
    totalCount: props.totalCount,
    siblingCount: props.siblingCount,
    pageSize: props.pageSize
  });

  if (!paginationRange) return null;

  // If there are less than 2 times in pagination range we shall not render the component
  if (props.currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    props.onPageChange(props.currentPage + 1);
  };

  const onPrevious = () => {
    props.onPageChange(props.currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <Pagination
      className='pagination-container'
    >
       {/* Left navigation arrow */}
      <Pagination.First onClick={onPrevious} disabled={props.currentPage === 1}/>

      {paginationRange.map(pageNumber => {
         
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return <Pagination.Ellipsis key={pageNumber + Math.random().toString()} />;
        }
		
        // Render our Page Pills
        return (

            <Pagination.Item active={props.currentPage === pageNumber} key={pageNumber}
                onClick={typeof pageNumber == "number" ? () => props.onPageChange(pageNumber) : () => {}}>
                {pageNumber}
            </Pagination.Item>
        );
      })}
      {/*  Right Navigation arrow */}
      <Pagination.Last onClick={onNext} disabled={props.currentPage === lastPage}/>

    </Pagination>
  );
};