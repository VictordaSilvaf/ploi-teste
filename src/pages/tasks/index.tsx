import Aside from "../../components/Aside";
import BaseButton from "../../components/BaseButton";
import Heading from "../../components/Heading";

const people = [
  { id: 1, name: "Annette Black" },
  { id: 2, name: "Cody Fisher" },
  { id: 3, name: "Courtney Henry" },
  { id: 4, name: "Kathryn Murphy" },
  { id: 5, name: "Theresa Webb" },
];

export default function Tasks() {
  return (
    <Aside>
      <Heading
        rightButtomGroup={
          <div className="flex items-center gap-x-4">
            <BaseButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Adicionar tarefa
            </BaseButton>
          </div>
        }
      ></Heading>

      <fieldset>
        <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
          {people.map((person, personIdx) => (
            <div className="">
              <label
                key={personIdx}
                htmlFor={`person-${person.id}`}
                className="font-medium text-gray-900 select-none"
              >
                <div className="relative flex items-start py-4">
                  <div className="flex-1 min-w-0 text-sm leading-6">
                    {person.name}
                  </div>
                  <div className="flex items-center h-6 ml-3">
                    <input
                      id={`person-${person.id}`}
                      name={`person-${person.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                    />
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </Aside>
  );
}
