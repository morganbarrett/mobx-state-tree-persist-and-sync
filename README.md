# `mobx-state-tree-persistence`

```javascript
import {observer} from "mobx-react-lite";
import {types} from "mobx-state-tree";
import {persist} from "mobx-state-tree-persist-and-sync";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FooModel = types.model("foo").props({
	test: "hello world"
});

const BarModel = types.model("bar").props({
	test: false
});

const RootModel = types.model("root").props({
	foo: FooModel,
	bar: BarModel
});

const rootStore = RootModel.create({
	foo: {},
	bar: {}
});

const persistStore = persist(rootStore, ["foo", "bar"], AsyncStorage);

const App = observer(() => {
	if (!persistStore.isRehydrated) {
		return null;
	}

	return <Text>{rootStore.foo.test}</Text>;
});

onRemoteContent(data =>
	persistStore.applyUpdate(rootStore, data.key, data.value)
);
```
