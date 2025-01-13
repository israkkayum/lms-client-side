import * as Tabs from "@radix-ui/react-tabs";
import EditContent from "../EditContent/EditContent";
import { useParams } from "react-router-dom";
import useCourse from "../../../hooks/useCourse";
const EditCourse = () => {
  const { courseId } = useParams();
  const [course, isLoading] = useCourse(courseId);
  // console.log(course);
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 mt-8">
      <Tabs.Root defaultValue="contents">
        <Tabs.List
          className="w-fit border-b flex items-center gap-x-3 overflow-x-auto text-sm mb-5"
          aria-label="Manage your account"
        >
          <Tabs.Trigger
            className="group outline-none py-1.5 border-b-2 border-white text-gray-500 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
            value="contents"
          >
            <div className="py-1.5 px-3 rounded-lg duration-150 group-hover:text-indigo-600 group-hover:bg-gray-50 group-active:bg-gray-100 font-medium">
              Contents
            </div>
          </Tabs.Trigger>
          <Tabs.Trigger
            className="group outline-none py-1.5 border-b-2 border-white text-gray-500 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
            value="settings"
          >
            <div className="py-1.5 px-3 rounded-lg duration-150 group-hover:text-indigo-600 group-hover:bg-gray-50 group-active:bg-gray-100 font-medium">
              Settings
            </div>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content className="py-6" value="contents">
          <p className="text-xs leading-normal">
            <EditContent course={course} isLoading={isLoading} />
          </p>
        </Tabs.Content>
        <Tabs.Content className="py-6" value="settings">
          <p className="text-xs leading-normal">
            This is <b>settings</b> Tab
          </p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default EditCourse;
