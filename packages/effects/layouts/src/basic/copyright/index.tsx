interface CopyrightProps {
  companyName: string;
  companySiteLink?: string;
  date: string;
  icp?: string;
  icpLink?: string;
}

function Copyright({
  icp = '',
  icpLink = '',
  date = '2024',
  companyName = 'Xpress',
  companySiteLink = '',
}: CopyrightProps) {
  return (
    <div className="text-md flex-center">
      {/* ICP Link  */}
      {icp && (
        <a
          className="hover:text-primary-hover mx-1"
          href={icpLink || 'javascript:void(0)'}
          rel="noreferrer"
          target="_blank"
        >
          {icp}
        </a>
      )}
      {/* Copyright Text */}
      Copyright © {date}
      {/* Company Link */}
      {companyName && (
        <a
          className="hover:text-primary-hover mx-1"
          href={companySiteLink || 'javascript:void(0)'}
          rel="noreferrer"
          target="_blank"
        >
          {companyName}
        </a>
      )}
    </div>
  );
}

export default Copyright;
