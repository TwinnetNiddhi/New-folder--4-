import React from 'react';
import '../../Component/SkeletonLoader/SkeletonLoader.css'; 

const ContinuousSkeletonLoader = () => {
     const skeletonItems = Array.from({ length: 10 }, (_, index) => index);

    return (
        <>
            {skeletonItems.map((item) => (
                <tr key={item}>
                    <td colSpan="8" className="skeleton-loader">
                        <div className="skeleton-line"></div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default ContinuousSkeletonLoader;
