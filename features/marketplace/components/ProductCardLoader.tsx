import { Skeleton } from "primereact/skeleton";

const ProductCardLoader = () => {
  return (
    <div
      className={`rounded-2xl border border-gray-300 flex flex-col gap-3 px-3 py-3`}
    >
      <Skeleton className={`rounded-xl`} width="100%" height="100px" />
      <div className={`flex flex-col gap-1`}>
        <Skeleton width="200px" height="10px" />
        <Skeleton width="100%" height="10px" />
      </div>
      <div className={`flex flex-col gap-1`}>
        <Skeleton width="60%" height="10px" />
        <Skeleton width="60px" height="10px" />
      </div>
      <div className={`flex items-center justify-between gap-2 text-black`}>
        <Skeleton width="100px" height="10px" />
        <Skeleton width="100px" height="10px" />
      </div>
      <div className={`flex items-center gap-1`}>
        <Skeleton width="15px" height="15px" />
        <Skeleton width="200px" height="10px" />
      </div>
      
      <div className={`flex items-center gap-1`}>
        <Skeleton shape="circle" width="15px" height="15px" />
        <Skeleton width="100%" height="10px" />
      </div>
      <div className={`flex items-center gap-1`}>
        <Skeleton shape="circle" width="15px" height="15px" />
        <Skeleton width="100%" height="10px" />
      </div>
      <Skeleton width="100%" height="30px" />
    </div>
  );
};

export default ProductCardLoader;
