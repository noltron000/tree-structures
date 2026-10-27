# Tree Structures
> Hello! Welcome to my tree structures project.
> This module was a labor of love, as part of a project to create my own turn tracker for a game.
> Ultimately, this particular part of the project just ended up being a basic tree structure!
> I couldn't find a satisfactory tree data structure on npm, so I just made my own.
> Even if one did already exist after all, I like how mine turned out!!
>
> I am all but certain that these tree structures can also be used elsewhere, within others' projects.
> And so, I uploaded this to npm.


## How to Install
You can install the npm package by running `yarn add noltron000/tree-structures` or `npm install @noltron000/tree-structures`.

## Navigating the Project's Exports
There are several things exported by this project, but most of them are types and abstract classes.
The documentation here will simply focus on only one of the two exports that actually have any substance.

**The two main exports are:**
- the `Tree` class
- the `RootedTree` class

Well, calling these classes "trees" might be a bit of a misnomer, because an instance of either class is actually a node of the tree.
So, you'd often do something like:
- `const node = new RootedTree( )`

### `Tree` versus `RootedTree`
I imagine that most coders will want access to the `RootedTree` class.

The main difference between the `Tree` class and the `RootedTree` class is that an instance of the `RootedTree` class stores a reference to the root node of the tree in its own property.
The `Tree` class does not have this property, which makes it more barebones and cumbersome.

If you were looking at the technical definition of a tree...well, then, a node doesn't necessarily know its root or its parent: a node just needs to know its direct children.
In this sense, the `Tree` class is more "pure" of a data structure.

Practically speaking, though?
Just use `RootedTree`.
The class instance methods need far fewer parameters passed through there.

### The Basics Using `RootedTree`
~~~ts
import {RootedTree} from "noltron000/tree-structures"

const root = new RootedTree( )
const child1 = root.create( )
const child2 = root.create( )

console.log(root)
~~~

Now, if you ran `console.log(root)`:
~~~ts
<ref *1> RootedTree {
	_children: Set(2) {
		RootedTree {
			_children: Set(0) {},
			data: undefined,
			_root: [Circular *1]
		},
		RootedTree {
			_children: Set(0) {},
			data: undefined,
			_root: [Circular *1]
		}
	},
	data: undefined,
	_root: [Circular *1]
}
*/
~~~

You can see three total instances of rooted tree, including a circular reference via the `_root` parameter.
Each node has a set of `_children`, and some `data`. Since we passed in no parameters creating the instance, `data` is undefined everywhere.

We can try adding some data:

~~~ts
import {RootedTree} from "noltron000/tree-structures"

// DataPayload type can be anything, but it defaults to `never`.
// This means no data can be added to nodes.
// So, be sure to explicitly add types!
type DataPayload = string

const root = new RootedTree<DataPayload>("I am ROOT.")
const child1 = root.create("I am a leaf!")
const child2 = root.create("Hey, me too! I am very leafy!")

console.log(root)
~~~

Once again, if you were to run this, you would see something like:
~~~ts
<ref *1> RootedTree {
	_children: Set(2) {
		RootedTree {
			_children: Set(0) {},
			data: 'I am a leaf!',
			_root: [Circular *1]
		},
		RootedTree {
			_children: Set(0) {},
			data: 'Hey, me too! I am very leafy!',
			_root: [Circular *1]
		}
	},
	data: 'I am ROOT.',
	_root: [Circular *1]
}
~~~

Please note that `_root` and `_children` properties are protected, meaning you aren't "supposed" to access them directly in typescript.
It'd be best practice to use the getter functions.

Try:

~~~ts
console.log(root.children)
console.log(child1.root)
~~~

### Catalogue of `RootedTree` Properties & Methods
#### Properties
- **`data`**
	- The data payload stored on this node. Its type is the `Data` type parameter, which defaults to `never`.
- **`size`**
	- The number of this node's direct children.
- **`children`**
	- A readonly set containing this node's direct children.
- **`root`**
	- The root node of this tree. On the root node itself, this returns that same node.

#### Mutation Methods
- **`create(data?)`**
	- Creates and returns a new child node, optionally storing a data payload on it.
- **`add(target)`**
	- Adds a separate root node as a child of this node. Returns `true` if the addition succeeds, or `false` if the nodes are already related or the target already has a parent.
- **`prune(target)`**
	- Removes a direct child from this node while leaving that child's own children attached to it. Returns whether a child was removed.
- **`delete(target)`**
	- Removes a direct child and adopts that child's direct children into this node. Returns whether a child was removed.

#### Introspection Methods
- **`isParent()`**
	- Returns whether this node has any children.
- **`isLeaf()`**
	- Returns whether this node has no children.
- **`isChild()`**
	- Returns whether this node has a parent (that is, whether it is not the root).
- **`isRoot()`**
	- Returns whether this node is the root of its tree.

#### Relationship Methods
- **`has(target)`**
	- Returns whether `target` is a direct child of this node. This is an alias for `hasChild(target)`.
- **`hasChild(target)`**
	- Returns whether `target` is a direct child of this node.
- **`hasDescendant(target)`**
	- Returns whether `target` appears anywhere below this node.
- **`hasLeaf(target)`**
	- Returns whether `target` is a leaf in this node's subtree.
- **`hasParent(target)`**
	- Returns whether `target` is this node's direct parent.
- **`hasAncestor(target)`**
	- Returns whether `target` is an ancestor of this node.
- **`hasRoot(target)`**
	- Returns whether `target` is this node's root.
- **`hasRelative(target)`**
	- Returns whether `target` belongs to the same tree as this node.

#### Collection Methods
- **`getChildren()`**
	- Returns this node's direct children as a readonly array; this is also available through `children`.
- **`getDescendants()`**
	- Returns all nodes below this node, excluding the node itself.
- **`getLeaves()`**
	- Returns the leaf nodes in this node's subtree. If this node is itself a leaf, the result contains this node.
- **`getParent()`**
	- Returns this node's direct parent, or `null` if this node is the root.
- **`getAncestors()`**
	- Returns this node's ancestors, from the root down to its direct parent.
- **`getRoot()`**
	- Returns the root node of this tree; this is also available through `root`.
- **`getRelatives()`**
	- Returns the root and every node in this tree.

#### Traversal Methods
- **`findPathTo(target)`**
	- Returns the path from this node to `target`, including both endpoints, or `null` if `target` is not in this node's subtree.
- **`traverse(visitFx, options?)`**
	- Visits nodes in this subtree and calls `visitFx` with each node and its path/depth metadata. Set `options.approach` to `'breadth-first'` or `'depth-first'`; if the visitor returns `true`, traversal stops early. The return value indicates whether the visitor stopped traversal early.
