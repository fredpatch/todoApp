import React, { useState } from "react";

// styled components
import {
  ListView,
  TodoText,
  HiddenButton,
  SwipedTodoText,
  ListViewHidden,
  TodoDate,
  colors,
} from "../styles/appStyles";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SwipeListView } from "react-native-swipe-list-view";
import { Entypo } from "@expo/vector-icons";

const ListItems = ({ todos, setTodos, handleTriggerEdit }) => {
  //For styling currently swiped todo row
  const [isSwiping, setIsSwiping] = useState(null);

  const handleDeleteTodo = (rowMap, rowKey) => {
    const newTodos = [...todos];
    const todoIndex = todos.findIndex((todo) => todo.key === rowKey);
    newTodos.splice(todoIndex, 1);
    
    AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos))
    .then(() => {
        setTodos(newTodos);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {todos.length == 0 && <TodoText> Nothing to do today.</TodoText>}
      {todos.length != 0 && (
        <SwipeListView
          data={todos}
          renderItem={(data) => {
            const RowText =
              data.item.key == isSwiping ? SwipedTodoText : TodoText;
            return (
              <ListView
                underlayColor={colors.primary}
                onPress={() => {
                  handleTriggerEdit(data.item);
                }}
              >
                <>
                  <RowText>{data.item.title}</RowText>
                  <TodoDate>{data.item.date}</TodoDate>
                </>
              </ListView>
            );
          }}
          renderHiddenItem={(data, rowMap) => {
            return (
              <ListViewHidden>
                <HiddenButton
                  onPress={() => handleDeleteTodo(rowMap, data.item.key)}
                >
                  <Entypo name="trash" size={25} color={colors.secondary} />
                </HiddenButton>
              </ListViewHidden>
            );
          }}
          leftOpenValue={88}
          previewRowKey={"1"}
          previewOpenValue={80}
          previewOpenDelay={3000}
          disableLeftSwipe={true}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingBottom: 30, marginBottom: 40 }}
          onRowOpen={(rowKey) => {
            setIsSwiping(rowKey);
          }}
          onRowClose={() => {
            setIsSwiping(null);
          }}
        />
      )}
    </>
  );
};

export default ListItems;
