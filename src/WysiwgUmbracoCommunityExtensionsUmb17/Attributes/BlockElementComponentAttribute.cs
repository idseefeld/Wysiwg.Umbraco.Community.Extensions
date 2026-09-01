using System;

namespace WysiwgUmbracoCommunityExtensions.Attributes;

/// <summary>
/// Marks a class as a Block Element Component so it can be discovered at runtime
/// (e.g. via reflection or Umbraco's TypeLoader) for auto-registration.
/// </summary>
[AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = false)]
public sealed class BlockElementComponentAttribute : Attribute
{
}
